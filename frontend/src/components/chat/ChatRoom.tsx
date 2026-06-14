import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '@/services/discussions';
import { joinRoom, leaveRoom } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/services/socket';
import { UserAvatar } from '@/components/ui/UserAvatar';
import type { ChatMessage } from '@/types';

interface ChatRoomProps {
  roomId: string;
}

export const ChatRoom = ({ roomId }: ChatRoomProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getMessages(roomId),
    enabled: !!roomId,
  });

  useEffect(() => {
    if (data?.data?.items) {
      setMessages(data.data.items);
    }
  }, [data]);

  const handleNewMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    const setup = async () => {
      await joinRoom(roomId);
      if (cancelled) return;

      const socket = getSocket();
      socket.on('new_message', handleNewMessage);

      socket.on('connect', () => {
        socket.emit('join_room', { roomId });
      });
    };

    setup();

    return () => {
      cancelled = true;
      leaveRoom(roomId);
      const socket = getSocket();
      socket.off('new_message', handleNewMessage);
      socket.off('connect');
    };
  }, [roomId, handleNewMessage]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    try {
      const res = await sendMessage({ content: input.trim(), roomId });
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
      setInput('');
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    } catch {
      setInput('');
    }
    setSending(false);
  };

  if (!roomId) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200/60 bg-gray-50/50 dark:border-gray-700/30 dark:bg-gray-900/30">
      <div className="flex items-center gap-2 border-b border-gray-200/60 px-4 py-3 dark:border-gray-700/30">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-purple-500 text-[10px] font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path d="M2.97 2.31a3.507 3.507 0 00-.47 0 1.5 1.5 0 00-1.485 1.522c0 .116.013.23.038.34L3.8 10.69a1.5 1.5 0 001.42.98h.041a1.5 1.5 0 001.389-.874l1.864-3.504a1.5 1.5 0 00-.027-1.42L6.34 2.917a1.5 1.5 0 00-1.179-.647 4.21 4.21 0 00-.096 0 5.491 5.491 0 00-1.454.338c-.219.088-.44.174-.663.248.098-.024.2-.04.306-.053.127-.016.256-.02.384-.02h.424z" />
            <path d="M11.78 5.5a.75.75 0 00-.733-.633 5.5 5.5 0 00-1.133.066c-.352.064-.702.164-1.042.294l.75 1.348c.424.215.912.305 1.407.24.164-.021.326-.056.482-.102a6.47 6.47 0 00-.08.107l-1.73 3.252a1.5 1.5 0 00.026 1.414l1.047 1.882a.75.75 0 001.31-.73l-.89-1.6a.245.245 0 01.04-.277.24.24 0 01.278-.04l2.573 1.43a.75.75 0 10.688-1.333l-2.33-1.294.064-.12a4.414 4.414 0 001.49-3.342c0-.23-.014-.46-.042-.688a5.43 5.43 0 00-.65-1.78z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discussion Room</span>
      </div>

      <div ref={listRef} className="h-64 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.author.id === user?.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {!isOwn && (
                  <Link to={`/profile/${msg.author.username}`}>
                    <UserAvatar src={msg.author.avatarUrl} username={msg.author.username} size="sm" className="rounded-full mb-0.5" />
                  </Link>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isOwn
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-white text-gray-700 shadow-sm rounded-bl-md dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {!isOwn && (
                    <Link to={`/profile/${msg.author.username}`} className="mb-0.5 text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                      {msg.author.username}
                    </Link>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`mt-0.5 text-[10px] ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {isOwn && (
                  <Link to={`/profile/${msg.author.username}`}>
                    <UserAvatar src={msg.author.avatarUrl} username={msg.author.username} size="sm" className="rounded-full mb-0.5" />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200/60 px-4 py-3 dark:border-gray-700/30">
          <input
            className="input-field !rounded-full !py-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white shadow-md shadow-primary-500/20 transition-all duration-200 hover:bg-primary-600 active:scale-95 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </form>
      ) : (
        <div className="border-t border-gray-200/60 px-4 py-3 text-center text-sm text-gray-400 dark:border-gray-700/30">
          Sign in to join the discussion
        </div>
      )}
    </div>
  );
};
