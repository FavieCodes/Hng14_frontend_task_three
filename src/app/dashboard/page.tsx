'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { getSession, clearSession, getHabits, saveHabits } from '@/lib/storage';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';

type LoadState = 'loading' | 'unauthorized' | 'ready';

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

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  function handleCreate(data: { name: string; description: string; frequency: 'daily' }) {
    if (!session) return;
    const newHabit: Habit = {
      id: uuidv4(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    const allHabits = getHabits();
    const updated = [...allHabits, newHabit];
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session.userId));
    setShowForm(false);
  }

  function handleEdit(data: { name: string; description: string; frequency: 'daily' }) {
    if (!editingHabit || !session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.map((h) =>
      h.id === editingHabit.id ? { ...h, name: data.name, description: data.description } : h
    );
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
    setEditingHabit(null);
  }

  function handleUpdate(updated: Habit) {
    if (!session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.map((h) => (h.id === updated.id ? updated : h));
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
  }

  function handleDelete(id: string) {
    if (!session) return;
    const allHabits = getHabits();
    const updatedAll = allHabits.filter((h) => h.id !== id);
    saveHabits(updatedAll);
    setHabits(updatedAll.filter((h) => h.userId === session.userId));
  }

  // ── Loading state ──────────────────────────────────────────
  if (loadState === 'loading' || loadState === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">
            {loadState === 'unauthorized' ? 'Redirecting…' : 'Loading your habits…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-gray-800">🌿 Habit Tracker</h1>
          <p className="text-xs text-gray-400">{session?.email}</p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="text-sm text-red-500 font-medium hover:text-red-700 focus:outline-none focus:underline"
        >
          Logout
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {!showForm && !editingHabit && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            + New Habit
          </button>
        )}

        {showForm && (
          <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        )}

        {editingHabit && (
          <HabitForm
            initial={editingHabit}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}

        {habits.length === 0 && !showForm && !editingHabit && (
          <div data-testid="empty-state" className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🌱</div>
            <p className="font-medium text-gray-500">No habits yet</p>
            <p className="text-sm mt-1">Create your first habit to get started</p>
          </div>
        )}

        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleUpdate}
              onEdit={(h) => { setEditingHabit(h); setShowForm(false); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}