import { useState, type ReactNode } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export const SidebarLayout = ({ children, sidebar }: SidebarLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex gap-6 lg:gap-8">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-24 space-y-5">
            {sidebar}
          </div>
        </aside>
      </div>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:bg-primary-700 active:scale-95 xl:hidden"
        aria-label="Open sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl animate-slide-in-right dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">More</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              {sidebar}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
