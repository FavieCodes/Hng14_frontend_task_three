'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

const FREQUENCY_LABELS: Record<string, string> = {
  'daily': 'Every Day',
  'weekdays': 'Weekdays',
  'weekends': 'Weekends',
  'twice-daily': 'Twice Daily',
  'three-times-daily': '3× Daily',
  'weekly': 'Weekly',
  'twice-weekly': '2× Weekly',
  'three-times-weekly': '3× Weekly',
  'twice-monthly': '2× Monthly',
  'monthly': 'Monthly',
  'quarterly': 'Quarterly',
  'biannually': 'Twice a Year',
  'yearly': 'Yearly',
};

export default function HabitCard({ habit, onUpdate, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);
  const freqLabel = FREQUENCY_LABELS[habit.frequency] ?? habit.frequency;

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    onUpdate(updated);
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-xl border p-4 transition-all ${
        isCompleted
          ? 'bg-emerald-50 border-emerald-300'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5">{habit.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              data-testid={`habit-streak-${slug}`}
              className="text-xs font-bold text-emerald-600"
            >
              🔥 {streak} day{streak !== 1 ? 's' : ''} streak
            </span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-xs font-medium text-gray-400">{freqLabel}</span>
          </div>
        </div>

        {/* Complete toggle */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          {isCompleted && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
        >
          <EditIcon />
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
        >
          <DeleteIcon />
          Delete
        </button>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-700 mb-2">
            Delete &ldquo;{habit.name}&rdquo;? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="flex items-center gap-1.5 text-xs font-bold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            >
              <DeleteIcon />
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-bold border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}