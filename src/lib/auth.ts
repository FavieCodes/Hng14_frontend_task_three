import { v4 as uuidv4 } from 'uuid';
import { User, Session } from '@/types/auth';
import { getUsers, saveUsers, saveSession, clearSession, getSession } from '@/lib/storage';

// ── Sign up ────────────────────────────────────────────────────────────────
export function signUp(
  email: string,
  password: string
): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const existing = users.find((u) => u.email === email);

  if (existing) {
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: uuidv4(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: Session = { userId: newUser.id, email: newUser.email };
  saveSession(session);

  return { success: true, session };
}

// ── Log in ─────────────────────────────────────────────────────────────────
export function logIn(
  email: string,
  password: string
): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);

  return { success: true, session };
}

// ── Log out ────────────────────────────────────────────────────────────────
export function logOut(): void {
  clearSession();
}

// ── Get current session ────────────────────────────────────────────────────
export function getCurrentSession(): Session | null {
  return getSession();
}

// ── Check if session is valid ──────────────────────────────────────────────
export function isAuthenticated(): boolean {
  const session = getSession();
  if (!session) return false;

  // Verify the user still exists in storage
  const users = getUsers();
  return users.some((u) => u.id === session.userId);
}

// ── Get user by id ─────────────────────────────────────────────────────────
export function getUserById(id: string): User | null {
  const users = getUsers();
  return users.find((u) => u.id === id) ?? null;
}