import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { STORAGE_KEYS } from '@/lib/constants';

// --- Users ---
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// --- Session ---
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return parsed ?? null;
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(null));
}

// --- Habits ---
export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
  return raw ? JSON.parse(raw) : [];
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}