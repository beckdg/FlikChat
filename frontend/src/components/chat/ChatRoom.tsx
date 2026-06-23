import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMessages, sendMessage, updateMessage, deleteMessage } from '@/services/discussions';
import { joinRoom, leaveRoom } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/services/socket';
import { UserAvatar } from '@/components/ui/UserAvatar';
import type { ChatMessage } from '@/types';

interface ChatRoomProps {
  roomId: string;
  variant?: 'full' | 'preview';
}

const PREVIEW_MAX = 5;

export const ChatRoom = ({ roomId, variant = 'full' }: ChatRoomProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editMsgContent, setEditMsgContent] = useState('');
  const [revealedMsgId, setRevealedMsgId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const initializedRoomRef = useRef<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getMessages(roomId),
    enabled: !!roomId,
  });

  useEffect(() => {
    if (data?.data?.items && initializedRoomRef.current !== roomId) {
      setMessages(data.data.items);
      initializedRoomRef.current = roomId;
    }
  }, [data, roomId]);

  const handleNewMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const handleMessageUpdated = useCallback((msg: ChatMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
  }, []);

  const handleMessageDeleted = useCallback(({ id }: { id: string }) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    const setup = async () => {
      await joinRoom(roomId);
      if (cancelled) return;

      const socket = getSocket();
      socket.on('new_message', handleNewMessage);
      socket.on('message_updated', handleMessageUpdated);
      socket.on('message_deleted', handleMessageDeleted);

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
      socket.off('message_updated', handleMessageUpdated);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('connect');
    };
  }, [roomId, handleNewMessage, handleMessageUpdated, handleMessageDeleted]);

  useEffect(() => {
    if (variant === 'full' && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, variant]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);

    try {
      const res = await sendMessage({ content: input.trim(), roomId });
      const msg = res.data;
      if (msg) {
        setMessages((prev) => { if (prev.some((m) => m.id === msg.id)) return prev; return [...prev, msg]; });
      }
      setInput('');
    } catch {
      setInput('');
    }
    setSending(false);
  };

  if (!roomId) return null;

  const displayMessages = variant === 'preview' ? messages.slice(-PREVIEW_MAX) : messages;

  return (
    <div className="rounded-xl border border-gray-200/60 bg-gray-50/50 dark:border-gray-700/30 dark:bg-gray-900/30">
      {variant === 'full' && (
        <div className="flex items-center gap-2 border-b border-gray-200/60 px-4 py-3 dark:border-gray-700/30">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-purple-500 text-[10px] font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path d="M2.97 2.31a3.507 3.507 0 00-.47 0 1.5 1.5 0 00-1.485 1.522c0 .116.013.23.038.34L3.8 10.69a1.5 1.5 0 001.42.98h.041a1.5 1.5 0 001.389-.874l1.864-3.504a1.5 1.5 0 00-.027-1.42L6.34 2.917a1.5 1.5 0 00-1.179-.647 4.21 4.21 0 00-.096 0 5.491 5.491 0 00-1.454.338c-.219.088-.44.174-.663.248.098-.024.2-.04.306-.053.127-.016.256-.02.384-.02h.424z" />
              <path d="M11.78 5.5a.75.75 0 00-.733-.633 5.5 5.5 0 00-1.133.066c-.352.064-.702.164-1.042.294l.75 1.348c.424.215.912.305 1.407.24.164-.021.326-.056.482-.102a6.47 6.47 0 00-.08.107l-1.73 3.252a1.5 1.5 0 00.026 1.414l1.047 1.882a.75.75 0 001.31-.73l-.89-1.6a.245.245 0 01.04-.277.24.24 0 01.278-.04l2.573 1.43a.75.75 0 10.688-1.333l-2.33-1.294.064-.12a4.414 4.414 0 001.49-3.342c0-.23-.014-.46-.042-.688a5.43 5.43 0 00-.65-1.78z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discussion Room</span>
          <span className="ml-auto text-xs text-gray-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {variant === 'preview' && (
        <div className="flex items-center gap-2 px-4 py-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-purple-500 text-[9px] font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
              <path d="M2.97 2.31a3.507 3.507 0 00-.47 0 1.5 1.5 0 00-1.485 1.522c0 .116.013.23.038.34L3.8 10.69a1.5 1.5 0 001.42.98h.041a1.5 1.5 0 001.389-.874l1.864-3.504a1.5 1.5 0 00-.027-1.42L6.34 2.917a1.5 1.5 0 00-1.179-.647 4.21 4.21 0 00-.096 0 5.491 5.491 0 00-1.454.338c-.219.088-.44.174-.663.248.098-.024.2-.04.306-.053.127-.016.256-.02.384-.02h.424z" />
              <path d="M11.78 5.5a.75.75 0 00-.733-.633 5.5 5.5 0 00-1.133.066c-.352.064-.702.164-1.042.294l.75 1.348c.424.215.912.305 1.407.24.164-.021.326-.056.482-.102a6.47 6.47 0 00-.08.107l-1.73 3.252a1.5 1.5 0 00.026 1.414l1.047 1.882a.75.75 0 001.31-.73l-.89-1.6a.245.245 0 01.04-.277.24.24 0 01.278-.04l2.573 1.43a.75.75 0 10.688-1.333l-2.33-1.294.064-.12a4.414 4.414 0 001.49-3.342c0-.23-.014-.46-.042-.688a5.43 5.43 0 00-.65-1.78z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Discussion</span>
          {messages.length > PREVIEW_MAX && (
            <span className="text-[11px] text-gray-400">+{messages.length - PREVIEW_MAX} more</span>
          )}
        </div>
      )}

      <div
        ref={listRef}
        className={`overflow-y-auto px-4 py-3 space-y-3 ${variant === 'preview' ? 'max-h-48' : 'h-96'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          displayMessages.map((msg) => {
            const isOwn = msg.author.id === user?.id;
            const isRevealed = revealedMsgId === msg.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {!isOwn && (
                  <Link to={`/profile/${msg.author.username}`}>
                    <UserAvatar src={msg.author.avatarUrl} username={msg.author.username} size="sm" className="rounded-full mb-0.5" />
                  </Link>
                )}
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-full sm:max-w-[75%]`}>
                  <div
                    className={`w-full rounded-2xl px-4 py-2.5 text-sm cursor-pointer ${
                      isOwn
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white text-gray-700 shadow-sm rounded-bl-md dark:bg-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => {
                      if (isOwn && !editingMsgId && variant === 'full') {
                        setRevealedMsgId(isRevealed ? null : msg.id);
                      }
                    }}
                  >
                    {!isOwn && (
                      <Link to={`/profile/${msg.author.username}`} className="mb-0.5 text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                        {msg.author.username}
                      </Link>
                    )}
                    {editingMsgId === msg.id ? (
                      <div className="space-y-2">
                        <input
                          className="input-field !py-1.5 !text-sm"
                          value={editMsgContent}
                          onChange={(e) => setEditMsgContent(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!editMsgContent.trim()) return;
                              try {
                                const res = await updateMessage(msg.id, { content: editMsgContent.trim() });
                                if (res.data) handleMessageUpdated(res.data);
                              } catch {}
                              setEditingMsgId(null);
                              setRevealedMsgId(null);
                            }}
                            className="text-[10px] font-semibold text-white/80 hover:text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMsgId(null);
                            }}
                            className="text-[10px] font-semibold text-white/60 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    )}
                    <p className={`mt-0.5 text-[10px] whitespace-nowrap ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {isOwn && isRevealed && !editingMsgId && (
                    <div className="flex items-center gap-1 mt-1 animate-fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMsgContent(msg.content);
                          setEditingMsgId(msg.id);
                          setRevealedMsgId(null);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await deleteMessage(msg.id);
                            handleMessageDeleted({ id: msg.id });
                          } catch {}
                          setRevealedMsgId(null);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
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

      {variant === 'preview' && messages.length > 0 && (
        <div className="border-t border-gray-200/60 px-4 py-2.5 dark:border-gray-700/30">
          <Link
            to={`/discussions/${roomId}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-50 py-2 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30"
          >
            Open full discussion
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}

      {variant === 'full' && isAuthenticated ? (
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
      ) : variant === 'full' ? (
        <div className="border-t border-gray-200/60 px-4 py-3 text-center text-sm text-gray-400 dark:border-gray-700/30">
          Sign in to join the discussion
        </div>
      ) : null}
    </div>
  );
};
