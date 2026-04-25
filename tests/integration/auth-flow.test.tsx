import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { saveUsers, getSession } from '@/lib/storage';

beforeEach(() => {
  localStorage.clear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'password123');
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('test@example.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    saveUsers([{ id: '1', email: 'dup@example.com', password: 'pass', createdAt: '' }]);
    render(<SignupForm />);
    await userEvent.type(screen.getByTestId('auth-signup-email'), 'dup@example.com');
    await userEvent.type(screen.getByTestId('auth-signup-password'), 'pass');
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });
  });

  it('submits the login form and stores the active session', async () => {
    saveUsers([{ id: '1', email: 'login@example.com', password: 'pass123', createdAt: '' }]);
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'pass123');
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session?.email).toBe('login@example.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByTestId('auth-login-email'), 'wrong@example.com');
    await userEvent.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});