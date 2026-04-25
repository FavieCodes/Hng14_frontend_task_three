import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Habit } from '@/types/habit';

const today = new Date().toISOString().split('T')[0];

const mockHabit: Habit = {
  id: 'h1',
  userId: 'u1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
};

describe('habit form', () => {
  beforeEach(() => localStorage.clear());

  it('shows a validation error when habit name is empty', async () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required');
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Drink Water', frequency: 'daily' })
      );
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const onSave = vi.fn();
    render(<HabitForm initial={mockHabit} onSave={onSave} onCancel={vi.fn()} />);
    const input = screen.getByTestId('habit-name-input');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Habit');
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated Habit' })
      );
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByTestId('habit-delete-drink-water'));
    expect(onDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(onDelete).toHaveBeenCalledWith('h1');
  });

  it('toggles completion and updates the streak display', async () => {
    const onUpdate = vi.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const streakEl = screen.getByTestId('habit-streak-drink-water');
    expect(streakEl).toHaveTextContent('0 day streak');
    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ completions: expect.arrayContaining([today]) })
    );
  });
});