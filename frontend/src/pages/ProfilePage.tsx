import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getMyProfile, updateProfile, uploadAvatar, uploadCover } from '@/services/users';
import { Button } from '@/components/ui/Button';

export const ProfilePage = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
    enabled: isAuthenticated,
  });

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username);
      setEditBio(profile.bio ?? '');
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setEditing(false);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-profile'] }),
  });

  const coverMutation = useMutation({
    mutationFn: uploadCover,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-profile'] }),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) coverMutation.mutate(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ username: editUsername, bio: editBio });
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
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
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="card overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-200 dark:bg-gray-800" />
          <div className="px-6 pb-6">
            <div className="-mt-12 h-24 w-24 rounded-2xl bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900" />
            <div className="mt-3 h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <div className="card overflow-hidden p-0">
        <div className="relative h-40 sm:h-48 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 dark:from-primary-800 dark:via-primary-700 dark:to-purple-800">
          {profile.coverUrl && (
            <img
              src={profile.coverUrl}
              alt="Cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <label className="absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M4.5 4.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V5a.5.5 0 00-.5-.5h-11zM3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              <path d="M13.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M2.5 13.5l3-3a.75.75 0 011.06 0l2.47 2.47L12 11.5a.75.75 0 011.06 0l3 3a.75.75 0 01-.53 1.28H3a.75.75 0 01-.5-1.28z" />
            </svg>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </label>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="relative -mt-14">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-4xl font-bold text-white shadow-lg shadow-primary-500/20 ring-4 ring-white dark:ring-gray-900 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <label className="absolute -right-1 bottom-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-md transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
                </svg>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  className="input-field"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  className="input-field min-h-[80px] resize-y"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-400">{editBio.length}/500</p>
              </div>
              <div className="flex gap-3">
                <Button type="submit" isLoading={updateMutation.isPending}>Save</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="mt-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.username}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              {profile.bio && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{profile.bio}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Questions', value: profile.questionCount, color: 'from-primary-500 to-blue-600', icon: 'M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z' },
          { label: 'Answers', value: profile.answerCount, color: 'from-emerald-500 to-teal-600', icon: 'M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z' },
          { label: 'Member since', value: new Date(profile.createdAt).toLocaleDateString(), color: 'from-purple-500 to-pink-600', icon: 'M6.75 3a.75.75 0 01.75.75V6h9V3.75a.75.75 0 011.5 0V6h1.5a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H3a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 013 6h1.5V3.75a.75.75 0 01.75-.75zM3 9v7.5h18V9H3z' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center transition-all hover:shadow-md">
            <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
              {typeof stat.value === 'number' ? (
                <span className="text-sm font-bold">{stat.value}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d={stat.icon} />
                </svg>
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Account Details</h2>
        <dl className="mt-4 space-y-3">
          {[
            { label: 'Username', value: profile.username },
            { label: 'Email', value: profile.email },
            { label: 'Bio', value: profile.bio || 'No bio yet' },
            { label: 'Joined', value: new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/30">
              <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate ml-4">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
