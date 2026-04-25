'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, saveSession } from '@/lib/storage';

type FormState = 'idle' | 'loading' | 'error';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-800">Log In</h1>

      {formState === 'error' && (
        <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={formState === 'loading'}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={formState === 'loading'}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        data-testid="auth-login-submit"
        type="submit"
        disabled={formState === 'loading'}
        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <p className="text-sm text-center text-gray-500">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-emerald-600 font-medium hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}