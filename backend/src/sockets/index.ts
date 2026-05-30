import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  registerSocketEvents(io);

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const registerSocketEvents = (socketServer: Server): void => {
  socketServer.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });

    socket.on('join_room', (payload: { roomId: string }) => {
      console.log(`[Socket] ${socket.id} joining room: ${payload.roomId}`);
      socket.join(payload.roomId);
    });

    socket.on('leave_room', (payload: { roomId: string }) => {
      console.log(`[Socket] ${socket.id} leaving room: ${payload.roomId}`);
      socket.leave(payload.roomId);
    });

    socket.on('send_message', (payload: { roomId: string; content: string }) => {
      console.log(`[Socket] Message in room ${payload.roomId}: ${payload.content}`);
      socket.to(payload.roomId).emit('new_message', {
        roomId: payload.roomId,
        content: payload.content,
        senderId: socket.id,
        timestamp: new Date().toISOString(),
      });
    });
  });
};
