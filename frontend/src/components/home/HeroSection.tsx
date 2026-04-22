import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      <Image
        src="/hero2.png"
        alt="KEFI Collection"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay — light at top for navbar readability, subtle at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

      {/* Bottom left content */}
      <div className="absolute bottom-0 left-0 pb-16 pl-14">
        <p className="text-white/70 text-[10px] font-medium uppercase tracking-[0.25em] mb-3">
          New Season
        </p>
        <h1 className="text-white text-[52px] font-light leading-[1.1] tracking-tight">
          Modern<br />Essentials
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 text-white text-[12px] font-medium tracking-[0.15em] uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
