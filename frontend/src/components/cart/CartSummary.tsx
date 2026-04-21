'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;

export default function CartSummary() {
  const { total } = useCart();
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = total + shipping;

  return (
    <div
      className="rounded-xl p-6 sticky top-20"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <h2 className="text-lg font-semibold text-[#111111] mb-5">Order Summary</h2>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#8C8880]">Subtotal</span>
          <span className="text-[#111111] font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8C8880]">Shipping</span>
          <span className="text-[#111111] font-medium">
            {shipping === 0 ? 'Free' : formatPrice(SHIPPING_COST)}
          </span>
        </div>
        {total < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-[#8C8880]">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - total)} more for free shipping
          </p>
        )}
        <div
          className="flex justify-between text-base font-semibold pt-3 mt-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-[#111111]">Total</span>
          <span className="text-[#111111]">{formatPrice(orderTotal)}</span>
        </div>
      </div>

      <Link href="/checkout" className="block mt-6">
        <Button variant="primary" fullWidth>
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        href="/shop"
        className="block text-center text-sm text-[#8C8880] hover:text-[#111111] transition-colors mt-4"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
