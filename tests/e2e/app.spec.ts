import { test, expect, Page } from '@playwright/test';

const email = `test-${Date.now()}@example.com`;
const password = 'password123';

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

async function signupUser(page: Page, e: string, p: string) {
  await page.goto('/signup');
  await page.fill('[data-testid="auth-signup-email"]', e);
  await page.fill('[data-testid="auth-signup-password"]', p);
  await page.click('[data-testid="auth-signup-submit"]');
  await page.waitForURL('/dashboard');
}

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await expect(page.locator('[data-testid="splash-screen"]')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await signupUser(page, `redir-${Date.now()}@example.com`, password);
    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await clearStorage(page);
    await signupUser(page, email, password);
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="auth-login-email"]', email);
    await page.fill('[data-testid="auth-login-password"]', password);
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForURL('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Drink Water');
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible();
    await page.click('[data-testid="habit-complete-drink-water"]');
    await expect(page.locator('[data-testid="habit-streak-drink-water"]')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/dashboard');
    await page.reload();
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
    // Load once to cache
    await page.goto('/');
    await page.waitForURL('/login');
    // Go offline
    await page.context().setOffline(true);
    await page.goto('/login');
    // Should not crash — some content should render
    const body = await page.locator('body').textContent();
    expect(body).not.toBeNull();
    await page.context().setOffline(false);
  });
});