'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 h-16"
    >
      <div className="max-w-7xl mx-auto h-full px-6 grid grid-cols-3 items-center">

        {/* Left — nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#8C8880] hover:text-[#111111] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#8C8880] hover:text-[#111111] transition-colors">
            Shop
          </Link>
        </div>

        {/* Center — logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/kefi-logo.svg" alt="KEFI" width={36} height={36} priority />
            <span className="text-[15px] font-medium tracking-[0.3em] text-[#111111]">K E F I</span>
          </Link>
        </div>

        {/* Right — icons */}
        <div className="flex items-center justify-end gap-5">
          <Link href={isLoggedIn ? '/orders' : '/auth/login'} className="text-[#8C8880] hover:text-[#111111] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {isLoggedIn && (
            <button onClick={logout} className="hidden md:block text-[13px] font-medium tracking-[0.08em] uppercase text-[#8C8880] hover:text-[#111111] transition-colors">
              Sign out
            </button>
          )}

          <Link href="/cart" className="relative text-[#8C8880] hover:text-[#111111] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#111111] text-[10px] font-semibold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#8C8880] hover:text-[#111111]">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
          className="md:hidden px-6 py-4 flex flex-col gap-4"
        >
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-[14px] text-[#8C8880] hover:text-[#111111]">Home</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-[14px] text-[#8C8880] hover:text-[#111111]">Shop</Link>
          {isLoggedIn ? (
            <>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-[14px] text-[#8C8880] hover:text-[#111111]">Orders</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-[14px] text-[#8C8880] hover:text-[#111111]">Sign out</button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-[14px] text-[#8C8880] hover:text-[#111111]">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
