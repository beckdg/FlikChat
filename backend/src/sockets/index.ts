import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { notificationService } from '../modules/notifications/notification.service';

let io: Server | null = null;

interface JwtPayload {
  userId: string;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const roomParticipants = new Map<string, Map<string, { username: string; joinedAt: Date }>>();

export const getRoomParticipants = (roomId: string) => {
  const participants = roomParticipants.get(roomId);
  if (!participants) return [];
  return Array.from(participants.entries()).map(([userId, info]) => ({
    userId,
    username: info.username,
    joinedAt: info.joinedAt,
  }));
};

const addParticipant = (roomId: string, userId: string, username: string) => {
  if (!roomParticipants.has(roomId)) {
    roomParticipants.set(roomId, new Map());
  }
  roomParticipants.get(roomId)!.set(userId, { username, joinedAt: new Date() });
};

const removeParticipant = (roomId: string, userId: string) => {
  const participants = roomParticipants.get(roomId);
  if (!participants) return;
  participants.delete(userId);
  if (participants.size === 0) {
    roomParticipants.delete(roomId);
  }
};

const emitParticipants = (roomId: string) => {
  const list = getRoomParticipants(roomId);
  io!.to(roomId).emit('participants_updated', list);
};

const removeUserFromAllRooms = (userId: string) => {
  for (const [roomId, participants] of roomParticipants) {
    if (participants.has(userId)) {
      removeParticipant(roomId, userId);
      emitParticipants(roomId);
    }
  }
};

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token ?? socket.handshake.query.token;
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(token as string, env.jwtSecret) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userLabel = socket.userId ?? 'anonymous';
    console.log(`[Socket] ${userLabel} connected: ${socket.id}`);

    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    socket.on('join_room', async (payload: { roomId: string }) => {
      socket.join(payload.roomId);
      console.log(`[Socket] ${userLabel} joined room: ${payload.roomId}`);

      if (socket.userId) {
        let username = 'Anonymous';
        try {
          const user = await prisma.user.findUnique({
            where: { id: socket.userId },
            select: { username: true },
          });
          if (user) username = user.username;
        } catch {}
        addParticipant(payload.roomId, socket.userId, username);
        emitParticipants(payload.roomId);
      }
    });

    socket.on('leave_room', (payload: { roomId: string }) => {
      socket.leave(payload.roomId);
      console.log(`[Socket] ${userLabel} left room: ${payload.roomId}`);

      if (socket.userId) {
        removeParticipant(payload.roomId, socket.userId);
        emitParticipants(payload.roomId);
      }
    });

    socket.on('send_message', async (payload: { roomId: string; content: string }) => {
      if (!socket.userId) {
        socket.emit('error', { message: 'Authentication required to send messages' });
        return;
      }
      if (!payload.content?.trim() || !payload.roomId) return;

      try {
        const message = await prisma.chatMessage.create({
          data: {
            content: payload.content.trim(),
            roomId: payload.roomId,
            authorId: socket.userId,
          },
          include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
          },
        });

        io!.to(payload.roomId).emit('new_message', message);

        const previousAuthors = await prisma.chatMessage.findMany({
          where: { roomId: payload.roomId, authorId: { not: socket.userId } },
          distinct: ['authorId'],
          select: { authorId: true },
        });

        for (const { authorId: targetId } of previousAuthors) {
          notificationService.create({
            userId: targetId,
            type: 'message_reply',
            title: 'New Reply',
            message: `${message.author.username} replied in a discussion you're part of`,
            senderId: socket.userId,
          });
        }
      } catch (err) {
        console.error('[Socket] Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ${userLabel} disconnected: ${socket.id}`);
      if (socket.userId) {
        removeUserFromAllRooms(socket.userId);
      }
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
};
