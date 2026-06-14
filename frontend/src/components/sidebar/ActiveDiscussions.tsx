interface ActiveDiscussion {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: string;
  online: boolean;
}

const MOCK: ActiveDiscussion[] = [
  { id: '1', title: 'React Server Components debate', messageCount: 47, lastActivity: '2m ago', online: true },
  { id: '2', title: 'Best way to handle auth in Next.js', messageCount: 32, lastActivity: '5m ago', online: true },
  { id: '3', title: 'Tailwind CSS v4 thoughts', messageCount: 28, lastActivity: '12m ago', online: false },
  { id: '4', title: 'TypeScript strict mode worth it?', messageCount: 19, lastActivity: '1h ago', online: false },
];

export const ActiveDiscussions = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.655V4.706c0-1.57 1.176-2.895 2.505-2.341z" />
          <path d="M14.5 6.5c1.064 0 2.09.07 3.09.195 1.416.177 2.41 1.36 2.41 2.74v3.346c0 1.506-1.032 2.782-2.505 2.942-.494.066-.994.124-1.495.172v3.443a.75.75 0 01-1.28.53l-2.98-2.98a4.47 4.47 0 01-.596-.595 3.5 3.5 0 011.09-.329c.588-.083 1.187-.15 1.79-.2A4.46 4.46 0 0115 11.24v-2.24c0-1.364-.625-2.602-1.622-3.5H14.5z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Active Discussions</h3>
    </div>
    <div className="space-y-1">
      {MOCK.map((d) => (
        <div
          key={d.id}
          className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <div className="relative mt-1 shrink-0">
            <div className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-500" />
            {d.online && (
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-900" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-700 truncate dark:text-gray-300">{d.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
              <span>{d.messageCount} messages</span>
              <span>{d.lastActivity}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
