'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  large?: boolean;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';

export default function ProductCard({ product, large = false }: ProductCardProps) {
  const { addItem } = useCart();

  const image = product.images?.[0] ?? PLACEHOLDER;
  const hasVariants = product.variants?.length > 0;
  const firstVariant = hasVariants ? product.variants[0] : null;

  // Simple sale badge: show if first variant price < product.price
  const showSale = firstVariant && firstVariant.price < product.price;
  const discount = showSale
    ? Math.round((1 - firstVariant!.price / product.price) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!firstVariant) return;
    addItem({ product, variant: firstVariant, quantity: 1 });
  }

  if (large) {
    return (
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
          <Image
            src={image}
            alt={product.name}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          {showSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discount}%
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-[16px] font-medium text-[#111111]">{product.name}</p>
          <p className="text-[15px] text-[#8C8880] mt-0.5">{formatPrice(firstVariant?.price ?? product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '1/1' }}>
        <Image
          src={image}
          alt={product.name}
          fill
          priority
          loading="eager"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
        />
        {showSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{discount}%
          </span>
        )}
        {/* Hover CTA */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-full bg-[#111111] text-white text-sm py-2.5 font-medium hover:bg-[#333333] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="mt-3">
        {product.category && (
          <p className="eyebrow mb-1">{product.category}</p>
        )}
        <p className="text-[14px] font-medium text-[#111111]">{product.name}</p>
        <p className="text-[14px] text-[#8C8880] mt-0.5">{formatPrice(firstVariant?.price ?? product.price)}</p>
      </div>
    </Link>
  );
}
