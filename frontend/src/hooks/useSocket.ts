import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/services/socket';

export const useSocket = () => {
  const socketRef = useRef(getSocket());

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return socketRef.current;
};
