import { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = habit.completions.includes(date)
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];


  const unique = [...new Set(completions)];

  return { ...habit, completions: unique };
}