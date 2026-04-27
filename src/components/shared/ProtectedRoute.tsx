'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';

type Props = {
  children: React.ReactNode;
};

type GuardState = 'checking' | 'authorized' | 'unauthorized';

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>('checking');

  useEffect(() => {
    if (isAuthenticated()) {
      setState('authorized');
    } else {
      setState('unauthorized');
      router.replace(ROUTES.LOGIN);
    }
  }, [router]);

  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #eff6ff 100%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Redirecting — render nothing to avoid flash
  if (state === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #eff6ff 100%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-400">Redirecting…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}