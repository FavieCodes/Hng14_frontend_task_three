'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveSession } from '@/lib/storage';

type FormState = 'idle' | 'loading' | 'error';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFormState('loading');

    await new Promise((r) => setTimeout(r, 600));

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      setFormState('error');
      return;
    }

    saveSession({ userId: user.id, email: user.email });
    router.push('/dashboard');
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">🌿</span>
          <span className="text-sm font-bold text-emerald-600 tracking-widest uppercase">
            Habit Tracker
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Welcome<br />
          <span className="text-emerald-600">back</span>
        </h1>
        <p className="mt-2 text-gray-500 font-medium text-sm">
          Log in to continue your streak.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {formState === 'error' && (
          <div role="alert" className="flex items-start gap-3 text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl font-medium">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-bold text-gray-800">
            Email address
          </label>
          <input
            id="login-email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={formState === 'loading'}
            required
            placeholder="you@example.com"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
          />
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-bold text-gray-800">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              data-testid="auth-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={formState === 'loading'}
              required
              placeholder="Enter your password"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none focus:text-emerald-600 transition-colors p-1 rounded-lg"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          data-testid="auth-login-submit"
          type="submit"
          disabled={formState === 'loading'}
          className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          {formState === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging in…
            </>
          ) : (
            'Log In'
          )}
        </button>

        <p className="text-sm text-center text-gray-500 font-medium">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-emerald-600 font-bold hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}