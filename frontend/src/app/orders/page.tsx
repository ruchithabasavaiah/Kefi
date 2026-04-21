'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGetOrders } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

function statusBadgeVariant(status: Order['status']) {
  switch (status) {
    case 'PAID': return 'success';
    case 'PENDING': return 'warning';
    case 'CANCELLED': return 'error';
    default: return 'default';
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('kefi_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    apiGetOrders()
      .then(setOrders)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-[32px] font-bold text-[#111111] mb-8">Order History</h1>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl font-semibold text-[#111111] mb-2">No orders yet</p>
            <p className="text-[#8C8880] text-sm mb-8">When you place an order it will appear here.</p>
            <a
              href="/shop"
              className="rounded-full bg-[#111111] text-white px-8 py-3 text-sm font-medium hover:bg-[#333333] transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="rounded-xl p-6"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-[#8C8880] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-[#111111]">{formatPrice(order.total)}</p>
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Items summary */}
                {order.items?.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs text-[#8C8880]">
                      {order.items.map(item => `${(item as any).variant?.product?.name ?? 'Item'} ×${item.quantity}`).join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
