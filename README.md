# 🌿 Habit Tracker PWA

A mobile-first **Progressive Web App** for building and tracking daily habits. Built for HNG Stage 3 as a technical translation task from a formal requirements document.

Users can sign up, log in, create habits, mark them complete daily, track streaks, and install the app on their device — all with local persistence via `localStorage`.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Running the App Locally](#running-the-app-locally)
- [Running Tests](#running-tests)
- [Deploying to Vercel](#deploying-to-vercel)
- [Local Persistence Structure](#local-persistence-structure)
- [PWA Implementation](#pwa-implementation)
- [Project Structure](#project-structure)
- [Test File Map](#test-file-map)
- [Trade-offs and Limitations](#trade-offs-and-limitations)

---

## Project Overview

This is a **Habit Tracker PWA** built to the specification of the HNG Stage 3 Technical Requirements Document. It is a front-end-only application with no remote database or external authentication service. All data is persisted locally in the browser via `localStorage`.

### What users can do

- Sign up with email and password
- Log in and log out
- Create, edit, and delete habits
- Mark a habit as complete for today (or unmark it)
- View a live streak counter per habit
- Reload the app and retain all saved data
- Install the app to their home screen as a PWA
- Load the app shell offline without a crash

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Persistence | `localStorage` (browser-native) |
| Unit & Integration Tests | Vitest + React Testing Library |
| End-to-End Tests | Playwright |
| Coverage | `@vitest/coverage-v8` |
| Deployment | Vercel |

---

## Prerequisites

Before setting up the project, make sure you have the following installed on your machine:

| Tool | Minimum Version | How to check |
|---|---|---|
| Node.js | v18.0.0 or later | `node --version` |
| npm | v9.0.0 or later | `npm --version` |
| Git | Any recent version | `git --version` |

To install Node.js, visit [https://nodejs.org](https://nodejs.org) and download the LTS version.

---

## Local Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/habit-tracker.git
cd habit-tracker
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including Next.js, Tailwind, Vitest, and Playwright.

### Step 3 — Generate PWA icons

The app requires two PNG icons for the PWA manifest. Generate them with:

```bash
node scripts/generate-icons.mjs
```

This creates:
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

> **Note:** This script requires the `sharp` package which is included as a dev dependency. If you get an error, run `npm install sharp` first.

### Step 4 — Install Playwright browsers

Playwright needs a browser binary to run end-to-end tests.

**Option A — Standard install (requires good internet):**
```bash
npx playwright install chromium
```

**Option B — If you are in Nigeria or have a slow connection (network timeout fix):**
```bash
set PLAYWRIGHT_DOWNLOAD_HOST=https://cdn.playwright.dev
npx playwright install chromium
```

**Option C — Use your already-installed Google Chrome (no download needed):**

Open `playwright.config.ts` and change the `projects` array to:

```ts
projects: [
  {
    name: 'chrome',
    use: { channel: 'chrome' },
  },
],
```

Then remove or skip the `npx playwright install` step entirely.

---

## Running the App Locally

### Development mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will hot-reload as you make changes. The splash screen appears first, then redirects based on your session state.

### Production build (optional, to verify the build works)

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). This simulates what Vercel will run.

---

## Running Tests

The project has three layers of tests. Run them separately or all at once.

### Run all tests

```bash
npm test
```

This runs unit tests → integration tests → E2E tests in sequence.

> **Important:** The dev server must be running before you run E2E tests if you are not using `webServer` in Playwright config. Open a separate terminal and run `npm run dev` first.

---

### Unit tests only

```bash
npm run test:unit
```

This runs all files matching `tests/unit/**/*.test.ts` and generates a **coverage report** in the `coverage/` folder.

After running, open `coverage/index.html` in your browser to view line-by-line coverage. The minimum required threshold is **80% line coverage** for all files in `src/lib/`.

**What is tested:**
- `getHabitSlug` — slug generation from habit names
- `validateHabitName` — name validation rules and error messages
- `calculateCurrentStreak` — streak calculation from completion arrays
- `toggleHabitCompletion` — adding/removing completion dates without mutation

---

### Integration tests only

```bash
npm run test:integration
```

This runs all files matching `tests/integration/**/*.test.tsx` using Vitest + React Testing Library. It renders components in a simulated browser (jsdom) and verifies their behavior.

**What is tested:**
- `auth flow` — signup creates a session, duplicate email is rejected, login validates credentials, wrong credentials show an error
- `habit form` — empty name shows a validation error, creating a habit calls save handler, editing preserves immutable fields, deletion requires explicit confirmation, toggling completion updates the streak display

---

### End-to-end tests only

```bash
npm run test:e2e
```

This launches a real Chromium browser and runs full user-journey tests against your running Next.js app. Playwright handles starting the dev server automatically via `webServer` config.

**What is tested:**
- Splash screen appears and redirects unauthenticated users to `/login`
- Authenticated users visiting `/` are redirected to `/dashboard`
- Visiting `/dashboard` without a session redirects to `/login`
- Signing up creates a session and shows the dashboard
- Logging in loads only that user's habits
- Creating a habit from the dashboard renders a habit card
- Completing a habit updates the streak counter
- Session and habits persist after a full page reload
- Logging out clears the session and redirects to `/login`
- The app shell loads offline after the app has been visited once

---

### View the coverage report

After running `npm run test:unit`, open:

```
coverage/index.html
```

in your browser, or run:

```bash
# On Windows
start coverage/index.html

# On Mac
open coverage/index.html
```

---

## Deploying to Vercel

### Option A — Deploy via Vercel CLI (recommended)

**Step 1: Install the Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Log in to Vercel**
```bash
vercel login
```

Follow the prompts. Choose email or GitHub login.

**Step 3: Deploy**

From inside the project folder:
```bash
vercel
```

Vercel will ask a few questions:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N** (first time)
- Project name? → `habit-tracker` (or press Enter for default)
- In which directory is your code? → `.` (press Enter)
- Override settings? → **N**

After a moment, Vercel gives you a preview URL like:
```
https://habit-tracker-abc123.vercel.app
```

**Step 4: Deploy to production**
```bash
vercel --prod
```

This gives you your permanent production URL.

---

### Option B — Deploy via GitHub (automatic deployments)

**Step 1: Push your code to GitHub**
```bash
git add .
git commit -m "feat: habit tracker PWA stage 3"
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git push -u origin main
```

**Step 2: Connect to Vercel**

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `habit-tracker` repo
5. Leave all settings at their defaults (Vercel auto-detects Next.js)
6. Click **"Deploy"**

Vercel will build and deploy your app. Every future `git push` to `main` triggers a new automatic deployment.

---

### Vercel Build Settings (if you need to set them manually)

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Node.js Version | 18.x |

No environment variables are required — all persistence is client-side.

---

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys. No server, no database.

### `habit-tracker-users`

Stores an array of all registered users.

```json
[
  {
    "id": "uuid-string",
    "email": "user@example.com",
    "password": "plaintext-password",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### `habit-tracker-session`

Stores the currently active session, or `null` when logged out.

```json
{
  "userId": "uuid-string",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

Stores an array of all habits across all users. Each habit has a `userId` field that links it to its owner. The dashboard filters this list by the current session's `userId`.

```json
[
  {
    "id": "uuid-string",
    "userId": "uuid-string",
    "name": "Drink Water",
    "description": "8 glasses a day",
    "frequency": "daily",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "completions": ["2024-01-15", "2024-01-16", "2024-01-17"]
  }
]
```

**Completion dates** are stored as `YYYY-MM-DD` strings. Duplicates are prevented at the utility layer. The streak is calculated by counting consecutive dates backwards from today.

**To inspect your data in the browser:**
1. Open DevTools (`F12`)
2. Go to **Application → Local Storage → localhost:3000**
3. Click any key to see its value

**To reset all data:**
```js
// Run in the browser console
localStorage.clear()
```

---

## PWA Implementation

The app meets the basic installable PWA requirements:

### Files

| File | Purpose |
|---|---|
| `public/manifest.json` | Defines app name, icons, colors, and display mode |
| `public/sw.js` | Service worker that caches the app shell |
| `public/icons/icon-192.png` | Required PWA icon (192×192) |
| `public/icons/icon-512.png` | Required PWA icon (512×512) |
| `src/components/shared/ServiceWorkerRegister.tsx` | Client component that registers the SW on mount |

### How it works

1. On first load, the service worker installs and caches key routes (`/`, `/login`, `/signup`, `/dashboard`, `/manifest.json`)
2. On subsequent loads, the service worker intercepts fetch requests and serves cached responses
3. If the user goes offline after the first visit, the cached app shell renders without a hard crash
4. The browser shows an **"Install App"** prompt (on supported browsers/devices) based on the manifest

### Installing the app

- **On Android Chrome:** Tap the three-dot menu → "Add to Home Screen"
- **On Desktop Chrome:** Click the install icon in the address bar
- **On iOS Safari:** Tap Share → "Add to Home Screen"

---

## Project Structure

```
habit-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SW registration
│   │   ├── page.tsx            # / route — splash screen + redirect
│   │   ├── login/
│   │   │   └── page.tsx        # /login route
│   │   ├── signup/
│   │   │   └── page.tsx        # /signup route
│   │   └── dashboard/
│   │       └── page.tsx        # /dashboard route (protected)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   └── HabitForm.tsx
│   │   └── shared/
│   │       ├── SplashScreen.tsx
│   │       └── ServiceWorkerRegister.tsx
│   ├── lib/
│   │   ├── habits.ts           # toggleHabitCompletion
│   │   ├── slug.ts             # getHabitSlug
│   │   ├── storage.ts          # localStorage read/write helpers
│   │   ├── streaks.ts          # calculateCurrentStreak
│   │   └── validators.ts       # validateHabitName
│   └── types/
│       ├── auth.ts             # User, Session types
│       └── habit.ts            # Habit type
├── tests/
│   ├── unit/
│   │   ├── slug.test.ts
│   │   ├── validators.test.ts
│   │   ├── streaks.test.ts
│   │   └── habits.test.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   ├── e2e/
│   │   └── app.spec.ts
│   └── setup.ts                # Vitest global setup
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── scripts/
│   └── generate-icons.mjs      # Generates PNG icons via sharp
├── playwright.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## Test File Map

| Test File | Describe Block | What It Verifies |
|---|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` | Lowercase slug generation, space collapsing, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` | Empty input rejection, 60-char limit, trimmed value return |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Empty array, today not completed, consecutive days, duplicates, broken streak |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Add date, remove date, no mutation, no duplicates |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Signup → session created, duplicate email error, login → session stored, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | `habit form` | Empty name validation, create habit, edit with preserved fields, delete confirmation, completion toggle |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | All 10 full user journeys in a real browser from splash to offline shell |

---

## Trade-offs and Limitations

| Area | Decision | Reason / Trade-off |
|---|---|---|
| **Password storage** | Stored as plain text in `localStorage` | Required by spec (local-only auth). Not suitable for production — a real app would hash passwords server-side |
| **Authentication** | No JWT, no sessions expiry | Spec requires local-only auth. Session persists until explicit logout |
| **Data isolation** | Filtered client-side by `userId` | All users' data is in one localStorage key. A different user on the same browser could theoretically inspect it via DevTools |
| **Offline support** | App shell only, no data sync | Service worker caches routes but `localStorage` data is already local, so habits are available offline by nature |
| **Frequency** | Only `daily` implemented | Spec states only daily frequency is required for Stage 3 |
| **Streak calculation** | Based on calendar days, not 24-hour windows | Matches the YYYY-MM-DD completion format in the spec — completing at 11:59 PM and again at 12:01 AM counts as two separate days |
| **Icon generation** | Script-based with `sharp` | Avoids checking binary PNG files into git. Run once after cloning |
| **No real database** | localStorage only | Spec explicitly forbids remote databases for this stage |