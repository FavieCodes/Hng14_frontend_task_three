'use client';

import { Habit } from '@/types/habit';
import HabitCard from '@/components/habits/HabitCard';

type Props = {
  habits: Habit[];
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitList({ habits, onUpdate, onEdit, onDelete }: Props) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm"
      >
        <div className="text-6xl mb-4">🌱</div>
        <p className="font-bold text-gray-600 text-lg">No habits yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Hit{' '}
          <span className="font-semibold text-emerald-600">New Habit</span>{' '}
          to plant your first one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}