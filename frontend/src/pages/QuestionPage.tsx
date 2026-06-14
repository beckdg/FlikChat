import { useParams } from 'react-router-dom';

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.374-.19.535-.349.68-.595.68-1.691 0-2.285zM12 16.5a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Question Detail</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse answers and join the discussion
            </p>
          </div>
          <div className="hidden sm:flex h-9 items-center rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            #{id}
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
            A
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Answers</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time discussion rooms for each answer
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center transition-colors dark:border-gray-600/40 dark:bg-gray-800/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mx-auto h-14 w-14 text-gray-300 dark:text-gray-600">
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
          <p className="mt-4 font-medium text-gray-500 dark:text-gray-400">
            No answers yet
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Answers and discussion rooms will appear here once implemented.
          </p>
        </div>
      </div>
    </div>
  );
};
