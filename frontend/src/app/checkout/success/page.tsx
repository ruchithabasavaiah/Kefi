'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const total = parseFloat(params.get('total') ?? '0');

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#111111] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-[#111111]">Order Confirmed</h1>
          <p className="text-[#8C8880] text-sm">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order details */}
        {orderId && (
          <div
            className="w-full rounded-xl p-5 flex flex-col gap-3 text-sm"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between">
              <span className="text-[#8C8880]">Order</span>
              <span className="font-medium text-[#111111]">#{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            {total > 0 && (
              <div className="flex justify-between">
                <span className="text-[#8C8880]">Total</span>
                <span className="font-medium text-[#111111]">{formatPrice(total)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#8C8880]">Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/orders"
            className="flex-1 rounded-full bg-[#111111] text-white px-6 py-3 text-sm font-medium text-center hover:bg-[#333333] transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 rounded-full border border-[#E8E4DF] text-[#111111] px-6 py-3 text-sm font-medium text-center hover:border-[#111111] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
