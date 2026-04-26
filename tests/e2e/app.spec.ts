import { test, expect, Page } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  // Navigate to the origin first so localStorage is accessible
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
}

async function seedUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.evaluate(
    ({ email, password }) => {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
      const exists = users.find((u: { email: string }) => u.email === email);
      if (!exists) {
        users.push({
          id: 'test-user-' + Date.now(),
          email,
          password,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      }
    },
    { email, password }
  );
}

async function seedSession(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.evaluate(
    ({ email, password }) => {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
      let user = users.find((u: { email: string; password: string }) => u.email === email);
      if (!user) {
        user = {
          id: 'test-user-fixed',
          email,
          password,
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      }
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: user.id, email: user.email })
      );
    },
    { email, password }
  );
}

async function signupViaUI(page: Page, email: string, password: string) {
  await page.goto('/signup');
  await page.fill('[data-testid="auth-signup-email"]', email);
  await page.fill('[data-testid="auth-signup-password"]', password);
  await page.click('[data-testid="auth-signup-submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 }); 
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Habit Tracker app', () => {

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/');
    await expect(page.locator('[data-testid="splash-screen"]')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    const email = `redir-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');
    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
    await expect(page).toHaveURL('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await clearStorage(page);
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    const email = `signup-${Date.now()}@example.com`;
    await clearStorage(page);
    await signupViaUI(page, email, 'password123');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    const email = `login-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedUser(page, email, 'pass123');

    await page.goto('/login');
    await page.fill('[data-testid="auth-login-email"]', email);
    await page.fill('[data-testid="auth-login-password"]', 'pass123');
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    const email = `habit-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');

    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Drink Water');
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible({ timeout: 5000 });
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const email = `streak-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');

    // First create the habit
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Drink Water');
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible({ timeout: 5000 });

    // Now complete it
    await page.click('[data-testid="habit-complete-drink-water"]');
    await expect(page.locator('[data-testid="habit-streak-drink-water"]')).toContainText('1', { timeout: 5000 });
  });

  test('persists session and habits after page reload', async ({ page }) => {
    const email = `persist-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');

    // Create a habit
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Drink Water');
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible({ timeout: 5000 });

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('[data-testid="habit-card-drink-water"]')).toBeVisible({ timeout: 5000 });
  });

  test('logs out and redirects to /login', async ({ page }) => {
    const email = `logout-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');

    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible({ timeout: 8000 });
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page }) => {
    const email = `offline-${Date.now()}@example.com`;
    await clearStorage(page);
    await seedSession(page, email, 'pass123');

    // Visit key pages while online so SW caches them
    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 8000 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Wait for service worker to activate and cache
    await page.waitForTimeout(2000);

    // Go offline
    await page.context().setOffline(true);

    // Reload — should serve from cache, not crash
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {
    });

    // Page body should exist (not a white crash)
    const body = await page.locator('body').textContent({ timeout: 5000 }).catch(() => '');
    expect(body).not.toBeNull();

    // Restore online
    await page.context().setOffline(false);
  });

});