import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import {
  getMyProfile, getProfileByUsername, updateProfile,
  uploadAvatar, deleteAccount,
  getUserStats, getUserQuestions, getUserAnswers, getUserDiscussions,
} from '@/services/users';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Tabs } from '@/components/ui/Tabs';
import type { UserQuestionItem, UserAnswerItem, UserDiscussionItem } from '@/types';

type ProfileTab = 'questions' | 'answers' | 'discussions';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return null;
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export const ProfilePage = () => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const { user: authUser, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('questions');
  const avatarRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = paramUsername
    ? authUser?.username === paramUsername
    : true;

  const targetUsername = paramUsername ?? authUser?.username;

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: paramUsername ? ['profile', paramUsername] : ['my-profile'],
    queryFn: paramUsername
      ? () => getProfileByUsername(paramUsername)
      : getMyProfile,
    enabled: !!targetUsername || isAuthenticated,
  });

  const profile = profileData?.data;

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats', targetUsername],
    queryFn: () => getUserStats(targetUsername!),
    enabled: !!targetUsername,
  });

  const stats = statsData?.data;

  const questionsQuery = useQuery({
    queryKey: ['user-questions', targetUsername],
    queryFn: () => getUserQuestions(targetUsername!),
    enabled: !!targetUsername,
  });

  const answersQuery = useQuery({
    queryKey: ['user-answers', targetUsername],
    queryFn: () => getUserAnswers(targetUsername!),
    enabled: !!targetUsername,
  });

  const discussionsQuery = useQuery({
    queryKey: ['user-discussions', targetUsername],
    queryFn: () => getUserDiscussions(targetUsername!),
    enabled: !!targetUsername,
  });

  const questions = questionsQuery.data?.data ?? [];
  const answers = answersQuery.data?.data ?? [];
  const discussions = discussionsQuery.data?.data ?? [];

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

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearAuth();
      navigate('/');
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ username: editUsername, bio: editBio });
  };

  if (!paramUsername && !isAuthenticated) {
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

  if (profileLoading || !profile) {
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="mx-auto h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mx-auto mt-2 h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'questions' as const, label: 'Questions', count: stats?.totalQuestions ?? questions.length },
    { id: 'answers' as const, label: 'Answers', count: stats?.totalAnswers ?? answers.length },
    { id: 'discussions' as const, label: 'Discussions', count: stats?.totalDiscussions ?? discussions.length },
  ];

  const joinedDate = formatDate(profile.createdAt);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="card overflow-hidden p-0">
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 dark:from-primary-800 dark:via-primary-700 dark:to-purple-800" />

        <div className="relative px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="relative -mt-14">
              <div className="relative">
                <UserAvatar src={profile.avatarUrl} username={profile.username} size="xl" className="ring-4 ring-white dark:ring-gray-900" />
                {isOwnProfile && (
                  <label className="absolute -right-1 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-md transition-transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
                    </svg>
                    <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <Button size="sm" variant="ghost" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            )}
          </div>

          {editing && isOwnProfile ? (
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
              {isOwnProfile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
              )}
              {profile.bio && (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{profile.bio}</p>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                </svg>
                Joined {joinedDate}
              </p>
            </div>
          )}
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="mx-auto h-9 w-9 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="mx-auto mt-2 h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Questions', value: stats.totalQuestions, icon: 'question' },
            { label: 'Answers', value: stats.totalAnswers, icon: 'answer' },
            { label: 'Upvotes', value: stats.totalUpvotes, icon: 'upvote' },
            { label: 'Discussions', value: stats.totalDiscussions, icon: 'discussion' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center transition-all hover:shadow-md">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-md shadow-primary-500/15">
                {stat.icon === 'question' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                )}
                {stat.icon === 'answer' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.5v2.719c0 1.224.383 2.358 1.027 3.28a2.7 2.7 0 01-.7-.295l-2.665-1.707a3.5 3.5 0 00-1.844-.562L3.5 11.5V3.5a1 1 0 01.005-1.135z" />
                    <path d="M18 5.5a2.75 2.75 0 00-2.75-2.75H9.75A2.75 2.75 0 007 5.5v2.719c0 1.564.607 3.035 1.627 4.146l.366.418-2.378-1.523a2.75 2.75 0 00-1.445-.442H3.5a.75.75 0 00-.75.75v6a.75.75 0 00.75.75h12a.75.75 0 00.75-.75v-10z" />
                  </svg>
                )}
                {stat.icon === 'upvote' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V6.75zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                )}
                {stat.icon === 'discussion' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.5v2.719c0 1.224.383 2.358 1.027 3.28a2.7 2.7 0 01-.7-.295l-2.665-1.707a3.5 3.5 0 00-1.844-.562L3.5 11.5V3.5a1 1 0 01.005-1.135z" />
                    <path d="M18 5.5a2.75 2.75 0 00-2.75-2.75H9.75A2.75 2.75 0 007 5.5v2.719c0 1.564.607 3.035 1.627 4.146l.366.418-2.378-1.523a2.75 2.75 0 00-1.445-.442H3.5a.75.75 0 00-.75.75v6a.75.75 0 00.75.75h12a.75.75 0 00.75-.75v-10z" />
                  </svg>
                )}
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="card p-0 overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as ProfileTab)} />
        <div className="p-4 sm:p-6">
          {activeTab === 'questions' && (
            <QuestionsTab
              data={questions}
              isLoading={questionsQuery.isLoading}
              isError={questionsQuery.isError}
              onRetry={() => questionsQuery.refetch()}
            />
          )}
          {activeTab === 'answers' && (
            <AnswersTab
              data={answers}
              isLoading={answersQuery.isLoading}
              isError={answersQuery.isError}
              onRetry={() => answersQuery.refetch()}
            />
          )}
          {activeTab === 'discussions' && (
            <DiscussionsTab
              data={discussions}
              isLoading={discussionsQuery.isLoading}
              isError={discussionsQuery.isError}
              onRetry={() => discussionsQuery.refetch()}
            />
          )}
        </div>
      </div>

      {isOwnProfile && (
        <div className="border-t border-gray-200/60 pt-6 space-y-3 dark:border-gray-700/30">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0014.75 2h-5.5A2.25 2.25 0 007 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-5.5a.75.75 0 01-.75-.75v-2a.75.75 0 00-1.5 0v2A2.25 2.25 0 009.25 18h5.5A2.25 2.25 0 0017 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M1 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H1.75A.75.75 0 011 10z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            Delete Account
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteAccountMutation.mutate()}
        title="Delete Account"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        warning="All your questions, answers, chat rooms, messages, votes, and profile data will be permanently deleted. You will lose access to all content immediately."
        confirmLabel={deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
        isLoading={deleteAccountMutation.isPending}
      />

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          clearAuth();
          navigate('/');
        }}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
      />
    </div>
  );
};

function QuestionsTab({ data, isLoading, isError, onRetry }: {
  data: UserQuestionItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 flex gap-3">
              <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load questions</p>
        <Button size="sm" variant="secondary" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No questions yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Questions you ask will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((q) => (
        <Link
          key={q.id}
          to={`/questions/${q.id}`}
          className="block rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800/30 dark:hover:bg-gray-800/50"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{q.title}</h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" clipRule="evenodd" />
              </svg>
              {q.answerCount} {q.answerCount === 1 ? 'answer' : 'answers'}
            </span>
            <span>{formatDate(q.createdAt)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AnswersTab({ data, isLoading, isError, onRetry }: {
  data: UserAnswerItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
            <div className="mt-1 h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="mt-2 flex gap-3">
              <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-7 w-28 rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load answers</p>
        <Button size="sm" variant="secondary" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.5v2.719c0 1.224.383 2.358 1.027 3.28a2.7 2.7 0 01-.7-.295l-2.665-1.707a3.5 3.5 0 00-1.844-.562L3.5 11.5V3.5a1 1 0 01.005-1.135z" />
            <path d="M18 5.5a2.75 2.75 0 00-2.75-2.75H9.75A2.75 2.75 0 007 5.5v2.719c0 1.564.607 3.035 1.627 4.146l.366.418-2.378-1.523a2.75 2.75 0 00-1.445-.442H3.5a.75.75 0 00-.75.75v6a.75.75 0 00.75.75h12a.75.75 0 00.75-.75v-10z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No answers yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Answers you post will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((a) => (
        <div key={a.id} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
          <Link to={`/questions/${a.questionId}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            {a.questionTitle}
          </Link>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{a.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M7.664 1.292a.75.75 0 01.672 0l6.25 3.25a.75.75 0 010 1.291l-6.25 3.25a.75.75 0 01-.672 0l-6.25-3.25a.75.75 0 010-1.291l6.25-3.25z" />
                  <path d="M1.5 8.25l5.914 3.075a.75.75 0 00.672 0L14 8.25v2.5a.75.75 0 01-.336.625l-5.5 3.2a.75.75 0 01-.728 0l-5.5-3.2A.75.75 0 011.5 10.75v-2.5z" />
                </svg>
                {a.voteCount} {a.voteCount === 1 ? 'vote' : 'votes'}
              </span>
              <span>{formatDate(a.createdAt)}</span>
            </div>
            <Link
              to={`/questions/${a.questionId}`}
              className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
            >
              View Discussion
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiscussionsTab({ data, isLoading, isError, onRetry }: {
  data: UserDiscussionItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
            <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
            <div className="mt-1 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="mt-2 flex gap-3">
              <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-7 w-28 rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load discussions</p>
        <Button size="sm" variant="secondary" onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.5v2.719c0 1.224.383 2.358 1.027 3.28a2.7 2.7 0 01-.7-.295l-2.665-1.707a3.5 3.5 0 00-1.844-.562L3.5 11.5V3.5a1 1 0 01.005-1.135z" />
            <path d="M18 5.5a2.75 2.75 0 00-2.75-2.75H9.75A2.75 2.75 0 007 5.5v2.719c0 1.564.607 3.035 1.627 4.146l.366.418-2.378-1.523a2.75 2.75 0 00-1.445-.442H3.5a.75.75 0 00-.75.75v6a.75.75 0 00.75.75h12a.75.75 0 00.75-.75v-10z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No discussions yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Join a discussion by participating in an answer's chat room</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.roomId} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
          <Link to={`/questions/${d.questionId}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            {d.questionTitle}
          </Link>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{d.answerSnippet}</p>
          {d.lastMessage && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
              <span className="font-medium">Last message:</span> {d.lastMessage}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M1 8.74a1.31 1.31 0 010-.48 7.98 7.98 0 1115.4 2.87A1 1 0 0115 12H9.56a1 1 0 01-.7-.3l-.92-.88a1.35 1.35 0 00-.94-.39H3.15a1.15 1.15 0 01-1.04-1.7z" />
                </svg>
                {d.totalMessages} {d.totalMessages === 1 ? 'message' : 'messages'}
              </span>
              {d.lastActivity && (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" clipRule="evenodd" />
                  </svg>
                  {timeAgo(d.lastActivity)}
                </span>
              )}
            </div>
            <Link
              to={`/discussions/${d.roomId}`}
              className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
            >
              Open Discussion
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
