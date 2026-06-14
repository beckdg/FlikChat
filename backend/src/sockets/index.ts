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

    socket.on('join_room', (payload: { roomId: string }) => {
      socket.join(payload.roomId);
      console.log(`[Socket] ${userLabel} joined room: ${payload.roomId}`);
    });

    socket.on('leave_room', (payload: { roomId: string }) => {
      socket.leave(payload.roomId);
      console.log(`[Socket] ${userLabel} left room: ${payload.roomId}`);
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
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
};
