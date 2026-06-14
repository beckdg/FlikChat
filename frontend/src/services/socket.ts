import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

let socket: Socket | null = null;

const getToken = () => localStorage.getItem('accessToken');

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: { token: getToken() },
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: getToken() };
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinRoom = (roomId: string): void => {
  getSocket().emit('join_room', { roomId });
};

export const leaveRoom = (roomId: string): void => {
  getSocket().emit('leave_room', { roomId });
};

export const sendSocketMessage = (roomId: string, content: string): void => {
  getSocket().emit('send_message', { roomId, content });
};

export default getSocket;
