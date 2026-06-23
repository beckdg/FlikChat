import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPopularTags } from '@/services/questions';

export const PopularTags = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: () => getPopularTags(10),
  });

  const tags = data?.data ?? [];

  if (!isLoading && tags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879c0 .663.263 1.3.732 1.768l6.5 6.5a2.5 2.5 0 003.536 0l3.878-3.878a2.5 2.5 0 000-3.536L11.147 3.732A2.5 2.5 0 009.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Popular Tags</h3>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/questions?search=${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
            >
              {tag.name}
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{tag.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
