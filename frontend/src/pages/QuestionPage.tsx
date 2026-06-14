import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestionById } from '@/services/questions';
import { getAnswersByQuestion, createAnswer } from '@/services/answers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ChatRoom } from '@/components/chat/ChatRoom';

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [answerContent, setAnswerContent] = useState('');
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const { data: qData, isLoading: qLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(id!),
    enabled: !!id,
  });

  const { data: aData, isLoading: aLoading } = useQuery({
    queryKey: ['answers', id],
    queryFn: () => getAnswersByQuestion(id!),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', id] });
      setAnswerContent('');
    },
  });

  const question = qData?.data;
  const answers = aData?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.trim() && id) {
      mutate({ content: answerContent.trim(), questionId: id });
    }
  };

  if (qLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card p-8 animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-20 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <p className="text-gray-500 dark:text-gray-400">Question not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="card overflow-hidden p-0">
        <div className="h-2 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600" />
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            {question.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-purple-500 text-[10px] font-bold text-white">
                {question.author.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{question.author.username}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{question.answerCount ?? 0} answers</span>
          </div>
          <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {question.content}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Answers ({answers.length})
          </h2>
        </div>

        {aLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-16 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : answers.length === 0 ? (
          <div className="card p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
            <p className="mt-4 font-medium text-gray-500 dark:text-gray-400">No answers yet</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Be the first to answer this question.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div key={answer.id} className="card overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-[10px] font-bold text-white">
                        {answer.author.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {answer.author.username}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
                      </svg>
                      {answer.voteCount}
                    </div>
                  </div>
                  <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {answer.content}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setExpandedRoom(expandedRoom === answer.id ? null : answer.id)}
                    className="flex w-full items-center gap-2 px-5 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                      <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                    </svg>
                    {expandedRoom === answer.id ? 'Hide Discussion' : 'Open Discussion Room'}
                  </button>
                  {expandedRoom === answer.id && answer.roomId && (
                    <div className="px-5 pb-4">
                      <ChatRoom roomId={answer.roomId} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Answer</h3>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="Write your answer..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            required
            minLength={10}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={isPending}>
              Post Answer
            </Button>
          </div>
        </form>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to post an answer
          </p>
        </div>
      )}
    </div>
  );
};
