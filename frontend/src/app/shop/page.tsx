'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiGetProducts } from '@/lib/api';
import { Product } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  useEffect(() => {
    apiGetProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category).filter(Boolean))),
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (category) {
      list = list.filter(p => p.category === category);
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, search, category, sort]);

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-6">
        <h1 className="text-[32px] font-bold text-[#111111]">All Products</h1>
        <p className="text-[#8C8880] text-sm mt-1">
          {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filter bar */}
      <div
        className="sticky top-16 z-30 py-4 px-8"
        style={{
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-[#E8E4DF] bg-white px-5 py-2.5 text-sm text-[#111111] placeholder-[#8C8880] focus:outline-none focus:ring-2 focus:ring-[#111111]"
          />

          {/* Category */}
          {categories.length > 0 && (
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="rounded-full border border-[#E8E4DF] bg-white px-5 py-2.5 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
            >
              <option value="">All categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="rounded-full border border-[#E8E4DF] bg-white px-5 py-2.5 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <ProductGrid products={filtered} loading={loading} />
      </div>
    </div>
  );
}
