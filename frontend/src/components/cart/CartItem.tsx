'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const image = item.product.images?.[0] ?? PLACEHOLDER;
  const unitPrice = item.variant.price ?? item.product.price;

  return (
    <div
      className="flex gap-4 py-5"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 80, height: 80 }}>
        <Image
          src={image}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111111] truncate">{item.product.name}</p>
        <p className="text-xs text-[#8C8880] mt-0.5">
          {item.variant.size} · {item.variant.color}
        </p>

        {/* Qty controls */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-[#E8E4DF] text-[#111111] text-sm flex items-center justify-center hover:border-[#111111] transition-colors"
          >
            −
          </button>
          <span className="text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.variant.stock}
            className="w-7 h-7 rounded-full border border-[#E8E4DF] text-[#111111] text-sm flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-sm font-medium text-[#111111]">
          {formatPrice(unitPrice * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-[#8C8880] hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
