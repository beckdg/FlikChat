import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, createQuestion } from '@/services/questions';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { AskQuestion } from '@/components/ui/AskQuestion';

export const QuestionsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => getQuestions(1, 50),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowForm(false);
    },
  });

  const questions = data?.data?.items ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Questions</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Browse questions or ask your own
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Ask Question'}
          </Button>
        )}
      </div>

      {showForm && (
        <AskQuestion
          onSubmit={(data) => mutate(data)}
          onCancel={() => setShowForm(false)}
          isPending={isPending}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600">
            <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400">No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="card relative flex items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link to={`/profile/${q.author.username}`} onClick={(e) => e.stopPropagation()}>
                <UserAvatar src={q.author.avatarUrl} username={q.author.username} size="md" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/questions/${q.id}`} className="after:absolute after:inset-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {q.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {q.content}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <Link to={`/profile/${q.author.username}`} className="relative z-10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {q.author.username}
                  </Link>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
                      <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
                    </svg>
                    {q.answerCount ?? 0}
                  </span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-1.5 h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
