'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { getSession, clearSession, getHabits, saveHabits } from '@/lib/storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';

type LoadState = 'loading' | 'unauthorized' | 'ready';
function Orb({ className }: { className: string }) {
  return <div className={`absolute rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse ${className}`} />;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      setLoadState('unauthorized');
      router.replace('/login');
      return;
    }
    setSession(s);
    const allHabits = getHabits();
    setHabits(allHabits.filter((h) => h.userId === s.userId));
    setLoadState('ready');
  }, [router]);

  // ── Logout ──────────────────────────────────────────────────
  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  // ── Create ──────────────────────────────────────────────────
  function handleCreate(data: { name: string; description: string; frequency: string }) {
    if (!session) return;
    const newHabit: Habit = {
      id: uuidv4(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: data.frequency,      
      createdAt: new Date().toISOString(),
      completions: [],
    };
    const allHabits = getHabits();
    const updated = [...allHabits, newHabit];
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session.userId));
    setShowForm(false);
  }

  // ── Edit ────────────────────────────────────────────────────
  function handleEdit(data: { name: string; description: string; frequency: string }) {
    if (!editingHabit || !session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.map((h) =>
      h.id === editingHabit.id
        ? {
            ...h,
            name: data.name,
            description: data.description,
            frequency: data.frequency,  
          }
        : h
    );
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
    setEditingHabit(null);
  }

  // ── Toggle completion ───────────────────────────────────────
  function handleUpdate(updated: Habit) {
    if (!session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.map((h) => (h.id === updated.id ? updated : h));
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
  }

  // ── Delete ──────────────────────────────────────────────────
  function handleDelete(id: string) {
    if (!session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.filter((h) => h.id !== id);
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
  }

  // ── Loading / redirect screen ───────────────────────────────
  if (loadState === 'loading' || loadState === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">
            {loadState === 'unauthorized' ? 'Redirecting…' : 'Loading your habits…'}
          </p>
        </div>
      </div>
    );
  }

  const completedToday = habits.filter((h) =>
    h.completions.includes(new Date().toISOString().split('T')[0])
  ).length;

  return (
    <div data-testid="dashboard-page" className="min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0fdfa 70%, #eff6ff 100%)' }}>

      {/* ── Decorative background orbs ── */}
      <Orb className="w-96 h-96 bg-emerald-300 top-[-6rem] left-[-6rem]" />
      <Orb className="w-80 h-80 bg-teal-200 top-32 right-[-4rem]" />
      <Orb className="w-64 h-64 bg-cyan-200 bottom-20 left-[-2rem]" />
      <Orb className="w-72 h-72 bg-green-200 bottom-[-3rem] right-10" />

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #a7f3d0 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="relative z-10 bg-white/70 backdrop-blur-md border-b border-white/60 px-4 py-3 flex items-center justify-between sticky top-0 shadow-sm">
        <div>
          <h1 className="font-extrabold text-gray-800 text-lg tracking-tight">
            🌿 Habit Tracker
          </h1>
          <p className="text-xs text-gray-400 truncate max-w-[180px]">{session?.email}</p>
        </div>

        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-bold text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </header>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="relative z-10 max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Stats bar */}
        {habits.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total', value: habits.length, icon: '📋' },
              { label: 'Done Today', value: completedToday, icon: '✅' },
              { label: 'Remaining', value: habits.length - completedToday, icon: '⏳' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-3 text-center"
              >
                <div className="text-lg">{stat.icon}</div>
                <div className="text-xl font-extrabold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Create button */}
        {!showForm && !editingHabit && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Habit
          </button>
        )}

        {/* Create form */}
        {showForm && (
          <HabitForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Edit form */}
        {editingHabit && (
          <HabitForm
            initial={editingHabit}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <div
            data-testid="empty-state"
            className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm"
          >
            <div className="text-6xl mb-4">🌱</div>
            <p className="font-bold text-gray-600 text-lg">No habits yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Hit <span className="font-semibold text-emerald-600">New Habit</span> to plant your first one
            </p>
          </div>
        )}

        {/* Habit list */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleUpdate}
              onEdit={(h) => {
                setEditingHabit(h);
                setShowForm(false);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}