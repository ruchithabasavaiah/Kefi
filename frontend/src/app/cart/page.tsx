'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-[32px] font-bold text-[#111111] mb-8">
          Your Cart
          {items.length > 0 && (
            <span className="text-[#8C8880] text-lg font-normal ml-3">({items.length} item{items.length !== 1 ? 's' : ''})</span>
          )}
        </h1>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C8880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#111111] mb-2">Your cart is empty</h2>
            <p className="text-[#8C8880] text-sm mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/shop"
              className="rounded-full bg-[#111111] text-white px-8 py-3 text-sm font-medium hover:bg-[#333333] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            {/* Items */}
            <div>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
