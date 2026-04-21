'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { apiCheckout } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create order + get clientSecret
      const checkoutItems = items.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      const { clientSecret, order } = await apiCheckout(checkoutItems);

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: form.name,
            email: form.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed. Please try again.');
        return;
      }

      // 3. Success
      router.push(`/checkout/success?orderId=${order.id}&total=${order.total}`);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Contact */}
      <section>
        <h2 className="text-base font-semibold text-[#111111] mb-4">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Full name"
            placeholder="Alex Johnson"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="alex@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </section>

      {/* Shipping */}
      <section>
        <h2 className="text-base font-semibold text-[#111111] mb-4">Shipping address</h2>
        <div className="flex flex-col gap-4">
          <Input
            name="address"
            label="Street address"
            placeholder="123 Main Street"
            value={form.address}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="city"
              label="City"
              placeholder="New York"
              value={form.city}
              onChange={handleChange}
              required
            />
            <Input
              name="state"
              label="State"
              placeholder="NY"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="zip"
              label="ZIP code"
              placeholder="10001"
              value={form.zip}
              onChange={handleChange}
              required
            />
            <Input
              name="country"
              label="Country"
              placeholder="United States"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </section>

      {/* Payment */}
      <section>
        <h2 className="text-base font-semibold text-[#111111] mb-4">Payment</h2>
        <div
          className="rounded-xl border border-[#E8E4DF] bg-white px-4 py-4"
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '15px',
                  color: '#111111',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#8C8880' },
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
        <p className="text-xs text-[#8C8880] mt-2 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secured by Stripe. We never store your card details.
        </p>
      </section>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!stripe || loading}
        size="lg"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </Button>
    </form>
  );
}
