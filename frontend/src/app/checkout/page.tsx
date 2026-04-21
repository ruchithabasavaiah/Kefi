'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('kefi_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    if (items.length === 0) {
      router.replace('/cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-[28px] font-bold text-[#111111] mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          {/* Left — form */}
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>

          {/* Right — summary */}
          <div
            className="rounded-xl p-6 h-fit sticky top-20"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
