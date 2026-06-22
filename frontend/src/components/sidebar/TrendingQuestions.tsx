import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrendingQuestions } from '@/services/questions';
import type { Question } from '@/types';

export const TrendingQuestions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-questions'],
    queryFn: getTrendingQuestions,
  });

  const questions: Question[] = data?.data ?? [];

  if (!isLoading && questions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trending Questions</h3>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5 rounded-lg px-2 py-2">
              <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-2.5 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {questions.map((q, index) => (
            <Link
              key={q.id}
              to={`/questions/${q.id}`}
              className="group flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <span className="mt-0.5 shrink-0 text-[10px] font-semibold text-gray-400 dark:text-gray-600">
                #{index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-primary-600 dark:text-gray-300 dark:group-hover:text-primary-400">
                  {q.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                  <span>{q.answerCount ?? 0} replies</span>
                  {q.tags && q.tags.length > 0 && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium dark:bg-gray-800">
                      {q.tags[0].name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
