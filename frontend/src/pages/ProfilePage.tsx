import { useAuthStore } from '@/store/authStore';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {isAuthenticated && user ? (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="text-lg text-gray-900">{user.username}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-lg text-gray-900">{user.email}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-500">Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
};
