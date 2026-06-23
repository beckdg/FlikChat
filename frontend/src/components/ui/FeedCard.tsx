import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleQuestionLike } from '@/services/questions';
import { createAnswer } from '@/services/answers';
import { useAuthStore } from '@/store/authStore';
import { UserAvatar } from './UserAvatar';
import { Button } from './Button';
import type { Question } from '@/types';

interface FeedCardProps {
  question: Question;
  queryKey: unknown[];
}

export const FeedCard = ({ question, queryKey }: FeedCardProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [showQuickAnswer, setShowQuickAnswer] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

  const isOwn = question.author.id === user?.id;

  const likeMutation = useMutation({
    mutationFn: () => toggleQuestionLike(question.id),
    onSuccess: (res) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items?.map((q: Question) =>
              q.id === question.id
                ? { ...q, likedByUser: res.data?.liked, likeCount: res.data?.likeCount }
                : q
            ),
          },
        };
      });
    },
  });

  const quickAnswerMutation = useMutation({
    mutationFn: (content: string) => createAnswer({ content, questionId: question.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setShowQuickAnswer(false);
      setAnswerContent('');
    },
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.trim()) {
      quickAnswerMutation.mutate(answerContent.trim());
    }
  };

  return (
    <div className={`card overflow-hidden transition-all duration-200 hover:shadow-md ${isOwn ? 'border-l-4 border-l-primary-500' : ''}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${question.author.username}`} className="shrink-0">
            <UserAvatar src={question.author.avatarUrl} username={question.author.username} size="md" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/questions/${question.id}`} className="group">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 line-clamp-2">
                  {question.title}
                </h3>
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => isAuthenticated && likeMutation.mutate()}
                  disabled={!isAuthenticated || likeMutation.isPending}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                    !isAuthenticated ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                  } ${question.likedByUser ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
                  </svg>
                  {question.likeCount ?? 0}
                </button>
              </div>
            </div>

            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {question.content}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
              <Link to={`/profile/${question.author.username}`} className="font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                {question.author.username}
              </Link>
              <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                  <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                </svg>
                {question.answerCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                  <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                </svg>
                {question.discussionCount ?? 0}
              </span>
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {question.tags.slice(0, 3).map((tag) => (
                    <span key={tag.id} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              {isAuthenticated && !isOwn && (
                <button
                  onClick={() => setShowQuickAnswer(!showQuickAnswer)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    showQuickAnswer
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                    <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                  </svg>
                  {showQuickAnswer ? 'Cancel' : 'Quick Answer'}
                </button>
              )}
              <Link
                to={`/questions/${question.id}`}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                Open Question
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {showQuickAnswer && (
              <form onSubmit={handleQuickSubmit} className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/50 dark:bg-gray-800/30">
                <textarea
                  className="input-field min-h-[80px] resize-y text-sm"
                  placeholder="Write a quick answer..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  required
                  minLength={10}
                  maxLength={5000}
                  autoFocus
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{answerContent.length}/5000</span>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" isLoading={quickAnswerMutation.isPending}>
                      Submit Answer
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
