'use client';

import { useState, FormEvent } from 'react';
import { validateHabitName } from '@/lib/validators';
import { Habit } from '@/types/habit';

type Props = {
  initial?: Habit;
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void;
  onCancel: () => void;
};

export default function HabitForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [frequency, setFrequency] = useState<string>(initial?.frequency ?? 'daily');
  const [nameError, setNameError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setNameError(result.error!);
      return;
    }
    setNameError('');
    onSave({ name: result.value, description, frequency: 'daily' });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
    >
      <h2 className="font-semibold text-gray-800">
        {initial ? 'Edit Habit' : 'New Habit'}
      </h2>

      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink Water"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {nameError && (
          <p role="alert" className="text-red-500 text-xs mt-1">{nameError}</p>
        )}
      </div>

      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details about this habit"
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <optgroup label="Daily">
            <option value="daily">Every Day</option>
            <option value="weekdays">Weekdays Only (Mon–Fri)</option>
            <option value="weekends">Weekends Only (Sat–Sun)</option>
          </optgroup>
          <optgroup label="Multiple Times">
            <option value="twice-daily">Twice a Day</option>
            <option value="three-times-daily">Three Times a Day</option>
          </optgroup>
          <optgroup label="Weekly">
            <option value="weekly">Once a Week</option>
            <option value="twice-weekly">Twice a Week</option>
            <option value="three-times-weekly">Three Times a Week</option>
          </optgroup>
          <optgroup label="Monthly">
            <option value="twice-monthly">Twice a Month</option>
            <option value="monthly">Once a Month</option>
          </optgroup>
          <optgroup label="Less Frequent">
            <option value="quarterly">Every 3 Months</option>
            <option value="biannually">Twice a Year</option>
            <option value="yearly">Once a Year</option>
          </optgroup>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}