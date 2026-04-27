import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #eff6ff 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-[-80px] w-56 h-56 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #6ee7b7 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 px-8 py-10 w-full max-w-sm">
        <SignupForm /></div>
    </main>
  );
}