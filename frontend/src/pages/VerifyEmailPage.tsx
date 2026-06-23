import { useState, useRef, type KeyboardEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { verifyEmail, resendOtp, checkVerificationStatus } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/utils/format';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const setAuth = useAuthStore((s) => s.setAuth);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: statusData } = useQuery({
    queryKey: ['verification-status', email],
    queryFn: () => checkVerificationStatus(email),
    enabled: !!email,
  });

  const alreadyVerified = statusData?.data?.emailVerified === true;

  const redirectToLogin = () => {
    navigate('/login', { replace: true });
  };

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: (code: string) => verifyEmail({ email, otp: code }),
    onSuccess: (res) => {
      if (res.success && res.data && 'tokens' in res.data) {
        setAuth(res.data.user, res.data.tokens.accessToken);
        navigate('/', { replace: true });
      }
    },
    onError: (err: unknown) => {
      const msg = getErrorMessage(err);
      if (msg === 'Email already verified') {
        redirectToLogin();
        return;
      }
      setError(msg);
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: () => resendOtp({ email }),
    onSuccess: () => {
      setResendMessage('A new verification code has been sent to your email');
      setError('');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const code = [...newDigits.slice(0, 5), value.slice(-1)].join('');
      if (code.length === 6) {
        verify(code);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length !== 6) return;
    setDigits(pasted.split(''));
    setError('');
    verify(pasted);
  };

  if (!email) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No email provided.</p>
          <Link to="/register" className="mt-2 inline-block text-sm font-semibold text-primary-600">
            Go back to registration
          </Link>
        </div>
      </div>
    );
  }

  if (alreadyVerified) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md animate-scale-in">
          <div className="card-glass p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Email Already Verified
            </h1>
            <p className="mt-1.5 text-gray-500 dark:text-gray-400">
              Your email <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span> is already verified.
            </p>
            <Button
              type="button"
              className="mt-6 w-full"
              size="lg"
              onClick={redirectToLogin}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card-glass p-8 sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-primary-500/25">
              F
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Verify Your Email
            </h1>
            <p className="mt-1.5 text-gray-500 dark:text-gray-400">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
            </p>
          </div>

          <div className="mt-8">
            <div
              className="flex items-center justify-center gap-3"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl border border-gray-200 text-center text-xl font-bold text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400"
                />
              ))}
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {resendMessage && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-green-50 p-3.5 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {resendMessage}
              </div>
            )}

            <Button
              type="button"
              className="mt-6 w-full"
              size="lg"
              isLoading={isVerifying}
              onClick={() => verify(digits.join(''))}
              disabled={digits.some((d) => !d)}
            >
              Verify Email
            </Button>
          </div>

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                disabled={isResending}
                onClick={() => resend()}
                className="font-semibold text-primary-600 transition-colors hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
