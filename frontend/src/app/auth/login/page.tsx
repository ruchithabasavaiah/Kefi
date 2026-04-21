import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div
      style={{ backgroundColor: 'var(--bg)' }}
      className="min-h-screen flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-[20px] font-bold tracking-widest text-[#111111]">
            KEFI
          </Link>
          <h1 className="text-xl font-semibold text-[#111111] mt-4">Welcome back</h1>
          <p className="text-sm text-[#8C8880] mt-1">Sign in to your account</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
