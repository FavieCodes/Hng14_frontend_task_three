// ── localStorage keys ──────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
} as const;

// ── Routes ─────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const;

// ── Habit frequency options ────────────────────────────────────────────────
export const FREQUENCY_OPTIONS = [
  { group: 'Daily', options: [
    { value: 'daily',    label: 'Every Day' },
    { value: 'weekdays', label: 'Weekdays Only (Mon–Fri)' },
    { value: 'weekends', label: 'Weekends Only (Sat–Sun)' },
  ]},
  { group: 'Multiple Times', options: [
    { value: 'twice-daily',       label: 'Twice a Day' },
    { value: 'three-times-daily', label: 'Three Times a Day' },
  ]},
  { group: 'Weekly', options: [
    { value: 'weekly',             label: 'Once a Week' },
    { value: 'twice-weekly',       label: 'Twice a Week' },
    { value: 'three-times-weekly', label: 'Three Times a Week' },
  ]},
  { group: 'Monthly', options: [
    { value: 'twice-monthly', label: 'Twice a Month' },
    { value: 'monthly',       label: 'Once a Month' },
  ]},
  { group: 'Less Frequent', options: [
    { value: 'quarterly',  label: 'Every 3 Months' },
    { value: 'biannually', label: 'Twice a Year' },
    { value: 'yearly',     label: 'Once a Year' },
  ]},
] as const;

// ── Frequency display labels ───────────────────────────────────────────────
export const FREQUENCY_LABELS: Record<string, string> = {
  'daily':             'Every Day',
  'weekdays':          'Weekdays',
  'weekends':          'Weekends',
  'twice-daily':       'Twice Daily',
  'three-times-daily': '3× Daily',
  'weekly':            'Weekly',
  'twice-weekly':      '2× Weekly',
  'three-times-weekly':'3× Weekly',
  'twice-monthly':     '2× Monthly',
  'monthly':           'Monthly',
  'quarterly':         'Quarterly',
  'biannually':        'Twice a Year',
  'yearly':            'Yearly',
};

// ── Validation limits ──────────────────────────────────────────────────────
export const VALIDATION = {
  HABIT_NAME_MAX_LENGTH: 60,
  PASSWORD_MIN_LENGTH: 6,
} as const;

// ── Splash screen timing ───────────────────────────────────────────────────
export const SPLASH_DURATION_MS = 1000;

// ── App metadata ───────────────────────────────────────────────────────────
export const APP_NAME = 'Habit Tracker';
export const APP_SHORT_NAME = 'Habits';
export const APP_DESCRIPTION = 'Track your daily habits and build streaks';