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
      const msg =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutate({ username, email, password });
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-500">Join the FlikChat community</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isPending}>
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
