import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/context/ThemeContext';
import { UserAvatar } from '@/components/ui/UserAvatar';

interface MainLayoutProps {
  children: ReactNode;
}

const bottomItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
  },
  {
    to: '/questions',
    label: 'Questions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
      </svg>
    ),
  },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-surface-dark dark:text-gray-100">
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/70 shadow-sm shadow-black/[0.02] backdrop-blur-xl transition-colors duration-300 dark:border-gray-700/40 dark:bg-gray-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition-all duration-200 group-hover:scale-110 group-hover:shadow-primary-500/30">
              F
            </div>
            <span className="text-lg font-bold gradient-text">FlikChat</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-1">
              {bottomItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-yellow-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-yellow-400"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
              <Link
                to="/profile"
                className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
              >
                <UserAvatar src={user?.avatarUrl} username={user?.username ?? 'U'} size="sm" className="rounded-full" />
              </Link>
              <button
                onClick={clearAuth}
                className="hidden sm:flex btn-ghost rounded-lg px-3 py-2 text-sm !text-red-500 hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-900/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:mr-1">
                  <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0014.75 2h-5.5A2.25 2.25 0 007 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-2a.75.75 0 00-1.5 0v2A2.25 2.25 0 009.25 18h5.5A2.25 2.25 0 0017 15.75V4.25z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M1 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H1.75A.75.75 0 011 10z" clipRule="evenodd" />
                </svg>
                <span>Logout</span>
              </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link to="/login" className="btn-ghost rounded-lg px-3 py-2 text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all duration-200 hover:bg-primary-700 hover:shadow-lg active:scale-[0.97]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20 sm:px-6 sm:py-8 sm:pb-8 lg:px-8 animate-fade-in">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/60 bg-white/90 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-gray-700/40 dark:bg-gray-900/90 sm:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-medium transition-all duration-200 ${
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className={`transition-all duration-200 ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-medium transition-all duration-200 ${
              location.pathname.startsWith('/profile') || location.pathname.startsWith('/login')
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className={`transition-all duration-200 ${location.pathname.startsWith('/profile') || location.pathname.startsWith('/login') ? 'scale-110' : ''}`}>
              {isAuthenticated ? (
                <UserAvatar src={user?.avatarUrl} username={user?.username ?? 'U'} size="sm" className="rounded-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
          </Link>
        </div>
      </nav>

      {isAuthenticated && (
        <div className="fixed bottom-16 right-4 z-50 sm:hidden">
          <button
            onClick={clearAuth}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:bg-red-600 active:scale-95"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0014.75 2h-5.5A2.25 2.25 0 007 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-2a.75.75 0 00-1.5 0v2A2.25 2.25 0 009.25 18h5.5A2.25 2.25 0 0017 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M1 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H1.75A.75.75 0 011 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <footer className="hidden sm:block border-t border-gray-200/50 bg-white/30 backdrop-blur-xl transition-colors duration-300 dark:border-gray-700/30 dark:bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 text-xs font-bold text-white">
                  F
                </div>
                <span className="font-bold gradient-text">FlikChat</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                A modern Q&A platform with real-time discussion rooms for every answer.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Platform</h4>
              <ul className="mt-3 space-y-2">
                {['Questions', 'Discussions', 'Community'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Support</h4>
              <ul className="mt-3 space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-400 dark:text-gray-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200/50 pt-6 text-center dark:border-gray-700/30">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FlikChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
