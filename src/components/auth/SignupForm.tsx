'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers, saveSession } from '@/lib/storage';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFormState('loading');

    // Small delay so loading state is visible/testable
    await new Promise((r) => setTimeout(r, 600));

    const users = getUsers();
    const exists = users.find((u) => u.email === email);

    if (exists) {
      setError('User already exists');
      setFormState('error');
      return;
    }

    const newUser = {
      id: uuidv4(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id, email: newUser.email });

    setFormState('success');

    // Show success message briefly, then redirect
    await new Promise((r) => setTimeout(r, 1500));
    router.push('/dashboard');
  }

  // ── Success screen ─────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Signup Successful!</h2>
        <p className="text-gray-500 text-sm">Welcome aboard. Taking you to your dashboard…</p>
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>

      {formState === 'error' && (
        <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="signup-email"
          data-testid="auth-signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={formState === 'loading'}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="signup-password"
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={formState === 'loading'}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        data-testid="auth-signup-submit"
        type="submit"
        disabled={formState === 'loading'}
        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {formState === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account…
          </>
        ) : (
          'Sign Up'
        )}
      </button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="text-emerald-600 font-medium hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}