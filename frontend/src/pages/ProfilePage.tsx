import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {isAuthenticated && user ? (
        <div className="space-y-6">
          <div className="card overflow-hidden p-0">
            <div className="h-28 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 dark:from-primary-800 dark:via-primary-700 dark:to-purple-800" />
            <div className="relative px-6 pb-6">
              <div className="-mt-12 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-3xl font-bold text-white shadow-lg shadow-primary-500/20 ring-4 ring-white dark:ring-gray-900">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="mt-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.username}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Questions', value: '0', color: 'from-primary-500 to-blue-600' },
              { label: 'Answers', value: '0', color: 'from-emerald-500 to-teal-600' },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 text-center">
                <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Account Details</h2>
            <dl className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/30">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Username</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/30">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/30">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Member since</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">Today</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 dark:from-gray-800 dark:to-gray-700 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Not signed in</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please sign in to view your profile.</p>
          <Link to="/login" className="btn-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};
