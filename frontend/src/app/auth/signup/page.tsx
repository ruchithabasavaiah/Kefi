import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
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
          <h1 className="text-xl font-semibold text-[#111111] mt-4">Create an account</h1>
          <p className="text-sm text-[#8C8880] mt-1">Join KEFI and discover modern essentials</p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
