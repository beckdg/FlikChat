import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMessages, sendMessage } from '@/services/discussions';
import { getSocket, joinRoom, leaveRoom, sendSocketMessage } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage } from '@/types';

interface ChatRoomProps {
  roomId: string;
}

export const ChatRoom = ({ roomId }: ChatRoomProps) => {
  const { user, isAuthenticated } = useAuthStore();
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

  useEffect(() => {
    if (!roomId) return;
    joinRoom(roomId);

    const socket = getSocket();
    const handler = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('new_message', handler);

    return () => {
      leaveRoom(roomId);
      socket.off('new_message', handler);
    };
  }, [roomId]);

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
      await sendMessage({ content: input.trim(), roomId });
      setInput('');
    } catch {
      // fallback to socket emit
      sendSocketMessage(roomId, input.trim());
      setInput('');
    }
    setSending(false);
  };

  if (!roomId) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200/60 bg-gray-50/50 dark:border-gray-700/30 dark:bg-gray-900/30">
      <div className="flex items-center gap-2 border-b border-gray-200/60 px-4 py-3 dark:border-gray-700/30">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-purple-500 text-[10px] font-bold text-white">
          C
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
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isOwn
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-white text-gray-700 shadow-sm rounded-bl-md dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {!isOwn && (
                    <p className="mb-0.5 text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                      {msg.author.username}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`mt-0.5 text-[10px] ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
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
