'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { apiGetProducts, apiGetVariants } from '@/lib/api';
import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import VariantSelector from '@/components/product/VariantSelector';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    apiGetProducts()
      .then(async products => {
        const found = products.find(p => p.slug === slug);
        if (!found) return;
        setProduct(found);
        const fetchedVariants = await apiGetVariants(found.id);
        setVariants(fetchedVariants);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="w-full rounded-xl animate-pulse bg-[#E8E4DF]" style={{ aspectRatio: '4/5' }} />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Derive the exact variant only when both size and color are chosen
  const selectedVariant =
    selectedSize && selectedColor
      ? (variants.find(v => v.size === selectedSize && v.color === selectedColor) ?? null)
      : null;

  const bothSelected = selectedSize !== null && selectedColor !== null;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;
  const price = selectedVariant?.price ?? product.price;

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    setQuantity(1);
  }

  function handleColorChange(color: string) {
    setSelectedColor(color);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!selectedVariant || !product) return;
    addItem({ product, variant: selectedVariant, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — gallery */}
          <ProductImageGallery images={product.images ?? []} productName={product.name} />

          {/* Right — details */}
          <div className="flex flex-col gap-6 lg:pt-4">
            {/* Category eyebrow */}
            {product.category && (
              <p className="eyebrow">{product.category}</p>
            )}

            {/* Name + price */}
            <div>
              <h1 className="text-[28px] font-bold text-[#111111] leading-tight">{product.name}</h1>
              <p className="text-[22px] text-[#111111] mt-2 font-medium">{formatPrice(price)}</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[15px] text-[#8C8880] leading-[1.7]">{product.description}</p>
            )}

            {/* Variant selector */}
            {variants.length > 0 && (
              <VariantSelector
                variants={variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={handleSizeChange}
                onColorChange={handleColorChange}
              />
            )}

            {/* Quantity — only show once both are selected */}
            {bothSelected && inStock && (
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-[#111111]">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full border border-[#E8E4DF] text-[#111111] flex items-center justify-center hover:border-[#111111] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedVariant!.stock, q + 1))}
                    disabled={quantity >= selectedVariant!.stock}
                    className="w-8 h-8 rounded-full border border-[#E8E4DF] text-[#111111] flex items-center justify-center hover:border-[#111111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Stock status */}
            {!bothSelected ? (
              <p className="text-sm text-[#8C8880]">Select size and color</p>
            ) : inStock ? (
              <p className="text-sm text-green-600">
                {selectedVariant!.stock <= 5
                  ? `Only ${selectedVariant!.stock} left in stock`
                  : 'In stock'}
              </p>
            ) : (
              <p className="text-sm text-red-500">Out of stock</p>
            )}

            {/* Add to Cart */}
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleAddToCart}
              disabled={!bothSelected || !inStock}
            >
              {added
                ? '✓ Added to Cart'
                : !bothSelected
                ? 'Select size and color'
                : inStock
                ? 'Add to Cart'
                : 'Out of Stock'}
            </Button>

            {/* Trust note */}
            <p className="text-xs text-[#8C8880] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure checkout · Free returns · Ships in 2–5 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
