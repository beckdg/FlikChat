import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';

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
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token ?? socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token as string, env.jwtSecret) as JwtPayload;
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Socket] User ${socket.userId} connected: ${socket.id}`);

    socket.on('join_room', (payload: { roomId: string }) => {
      socket.join(payload.roomId);
      console.log(`[Socket] ${socket.userId} joined room: ${payload.roomId}`);
    });

    socket.on('leave_room', (payload: { roomId: string }) => {
      socket.leave(payload.roomId);
      console.log(`[Socket] ${socket.userId} left room: ${payload.roomId}`);
    });

    socket.on('send_message', async (payload: { roomId: string; content: string }) => {
      if (!socket.userId) return;

      try {
        const message = await prisma.chatMessage.create({
          data: {
            content: payload.content,
            roomId: payload.roomId,
            authorId: socket.userId,
          },
          include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
          },
        });

        io!.to(payload.roomId).emit('new_message', message);
      } catch (err) {
        console.error('[Socket] Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User ${socket.userId} disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
};
