import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001';

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

const getToken = () => localStorage.getItem('accessToken');

const createSocket = (): Socket => {
  const s = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  return s;
};

export const getSocket = (): Socket => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

export const connectSocket = (): Promise<Socket> => {
  const s = getSocket();
  if (s.connected) return Promise.resolve(s);

  if (connectPromise) return connectPromise;

  connectPromise = new Promise((resolve) => {
    s.auth = { token: getToken() };
    s.connect();

    const onConnect = () => {
      s.off('connect', onConnect);
      connectPromise = null;
      resolve(s);
    };

    if (s.connected) {
      connectPromise = null;
      resolve(s);
    } else {
      s.on('connect', onConnect);
    }
  });

  return connectPromise;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
  connectPromise = null;
};

export const authenticated = (): void => {
  const s = getSocket();
  connectPromise = null;
  if (s.connected) {
    s.auth = { token: getToken() };
    s.disconnect().connect();
  }
};

export const joinRoom = async (roomId: string): Promise<void> => {
  const s = await connectSocket();
  s.emit('join_room', { roomId });
};

export const leaveRoom = async (roomId: string): Promise<void> => {
  const s = await connectSocket();
  s.emit('leave_room', { roomId });
};

export default getSocket;
