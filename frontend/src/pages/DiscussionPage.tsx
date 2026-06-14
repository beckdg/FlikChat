import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRoomById, getRoomParticipants } from '@/services/discussions';
import { getSocket } from '@/services/socket';
import { useAuthStore } from '@/store/authStore';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface Participant {
  userId: string;
  username: string;
  joinedAt: string;
}

export const DiscussionPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [participants, setParticipants] = useState<Participant[]>([]);

  const { data: roomData, isLoading: roomLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId!),
    enabled: !!roomId,
  });

  const room = roomData?.data;
  const answer = room?.answer;
  const question = answer?.question;

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    getRoomParticipants(roomId).then((res) => {
      if (!cancelled && res.data) setParticipants(res.data);
    }).catch(() => {});

    const socket = getSocket();
    const handleParticipants = (list: Participant[]) => {
      if (!cancelled) setParticipants(list);
    };
    socket.on('participants_updated', handleParticipants);

    return () => {
      cancelled = true;
      socket.off('participants_updated', handleParticipants);
    };
  }, [roomId]);

  if (roomLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800" />
        <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (!room || !answer) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Discussion not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <button
        onClick={() => navigate(question ? `/questions/${question.id}` : -1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back to question
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          {question && (
            <div className="rounded-xl border border-gray-200/60 bg-white px-5 py-4 dark:border-gray-700/30 dark:bg-gray-900/50">
              <Link
                to={`/questions/${question.id}`}
                className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors dark:text-gray-100 dark:hover:text-primary-400"
              >
                {question.title}
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <UserAvatar
                  src={answer.author.avatarUrl}
                  username={answer.author.username}
                  size="xs"
                  className="rounded-full"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {answer.author.username}
                </span>
                <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(answer.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                {answer.content}
              </p>
            </div>
          )}

          <ChatRoom roomId={roomId!} variant="full" />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-gray-200/60 bg-white p-4 dark:border-gray-700/30 dark:bg-gray-900/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary-400 to-purple-500 text-[10px] font-bold text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                  <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Participants ({participants.length})
              </span>
            </div>

            {participants.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">No active participants</p>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => {
                  const isCurrentUser = p.userId === user?.id;
                  return (
                    <div key={p.userId} className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <Link
                        to={`/profile/${p.username}`}
                        className={`text-xs font-medium hover:text-primary-600 transition-colors truncate ${
                          isCurrentUser
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {p.username}{isCurrentUser ? ' (you)' : ''}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Participants appear here when they join this discussion room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
