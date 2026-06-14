interface QuickActionsProps {
  onAskQuestion?: () => void;
}

export const QuickActions = ({ onAskQuestion }: QuickActionsProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.296L5.3 7.862 2.872 9.419a.75.75 0 000 1.296L5.3 12.16l-2.777 2.024a.75.75 0 000 1.296l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.296L14.7 12.16l2.428-1.445a.75.75 0 000-1.296L14.7 7.862l2.777-2.024a.75.75 0 000-1.296l-7.115-3.925z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
    </div>
    <div className="space-y-3">
      {onAskQuestion && (
        <button
          onClick={onAskQuestion}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 active:scale-[0.97]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018a.75.75 0 000 1.296L5.3 7.862 2.872 9.419a.75.75 0 000 1.296L5.3 12.16l-2.777 2.024a.75.75 0 000 1.296l7.115 3.925a.75.75 0 00.724 0l7.115-3.925a.75.75 0 000-1.296L14.7 12.16l2.428-1.445a.75.75 0 000-1.296L14.7 7.862l2.777-2.024a.75.75 0 000-1.296l-7.115-3.925z" />
          </svg>
          Ask Question
        </button>
      )}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs placeholder-gray-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-primary-500"
          placeholder="Search questions..."
          readOnly
        />
      </div>
    </div>
  </div>
);
