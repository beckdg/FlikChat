import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.tokens.accessToken);
        navigate('/');
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutate({ username, email, password });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card-glass p-8 sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-primary-500/25">
              F
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Join FlikChat
            </h1>
            <p className="mt-1.5 text-gray-500 dark:text-gray-400">
              Create your account and start exploring
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              icon="user"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              icon="lock"
            />
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
              Create Account
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
