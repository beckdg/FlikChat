import { useQuery } from '@tanstack/react-query';
import { getPopularTags } from '@/services/questions';
import type { PopularTag } from '@/types';

const TAG_COLORS = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
];

function getTagColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export const TopicFilters = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: () => getPopularTags(10),
  });

  const tags: PopularTag[] = data?.data ?? [];

  if (!isLoading && tags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 10A2.25 2.25 0 002 14.25v2.5A2.25 2.25 0 004.25 19h2.5A2.25 2.25 0 009 16.75v-2.5A2.25 2.25 0 006.75 14h-2.5zm10-10A2.25 2.25 0 0012 4.25v2.5A2.25 2.25 0 0014.25 9h2.5A2.25 2.25 0 0019 6.75v-2.5A2.25 2.25 0 0016.75 2h-2.5zm0 10A2.25 2.25 0 0012 14.25v2.5A2.25 2.25 0 0014.25 19h2.5A2.25 2.25 0 0019 16.75v-2.5A2.25 2.25 0 0016.75 14h-2.5z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trending Topics</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t.id}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium ${getTagColor(t.name)} transition-colors hover:opacity-80`}
          >
            {t.name}
            <span className="opacity-60">{t.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
