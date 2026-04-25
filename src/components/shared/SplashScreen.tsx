export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-emerald-600 z-50"
    >
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="mt-2 text-emerald-100 text-sm">Building better days</p>
      </div>
    </div>
  );
}