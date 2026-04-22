import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

export default function FeaturedProducts({ products, loading = false }: FeaturedProductsProps) {
  return (
    <section style={{ backgroundColor: 'var(--bg)' }} className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            
            <h2 className="text-[32px] font-bold text-[#111111]">Featured Picks</h2>
          </div>
          <Link
            href="/shop"
            className="text-[14px] text-[#8C8880] hover:text-[#111111] transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* 2-col editorial grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} large />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
