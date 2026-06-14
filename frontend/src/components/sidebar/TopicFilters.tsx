const TOPICS = [
  { label: 'React', count: 42, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'TypeScript', count: 38, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { label: 'Next.js', count: 31, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  { label: 'Node.js', count: 27, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { label: 'Tailwind', count: 22, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { label: 'Docker', count: 18, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' },
  { label: 'GraphQL', count: 14, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { label: 'Prisma', count: 11, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
];

export const TopicFilters = () => (
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
      {TOPICS.map((t) => (
        <span
          key={t.label}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium ${t.color} transition-colors hover:opacity-80`}
        >
          {t.label}
          <span className="opacity-60">{t.count}</span>
        </span>
      ))}
    </div>
  </div>
);
