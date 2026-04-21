import Image from 'next/image';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200';
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = total + shipping;

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111111] mb-6">Your Order</h2>

      <div className="flex flex-col gap-4 mb-6">
        {items.map(item => {
          const image = item.product.images?.[0] ?? PLACEHOLDER;
          const price = (item.variant.price ?? item.product.price) * item.quantity;
          return (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 56, height: 56 }}>
                <Image
                  src={image}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-white text-[10px] flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate">{item.product.name}</p>
                <p className="text-xs text-[#8C8880]">{item.variant.size} · {item.variant.color}</p>
              </div>
              <p className="text-sm font-medium text-[#111111]">{formatPrice(price)}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex justify-between text-sm">
          <span className="text-[#8C8880]">Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#8C8880]">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(SHIPPING_COST)}</span>
        </div>
        <div
          className="flex justify-between text-base font-semibold pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </div>
    </div>
  );
}
