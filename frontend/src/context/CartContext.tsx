'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';

interface AddItemPayload {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('kefi_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        // ignore
      }
    }
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem('kefi_cart', JSON.stringify(next));
  }

  function addItem({ product, variant, quantity }: AddItemPayload) {
    setItems(prev => {
      const existing = prev.find(i => i.variant.id === variant.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map(i =>
          i.variant.id === variant.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}`,
          product,
          variant,
          quantity,
        };
        next = [...prev, newItem];
      }
      localStorage.setItem('kefi_cart', JSON.stringify(next));
      return next;
    });
  }

  function removeItem(itemId: string) {
    persist(items.filter(i => i.id !== itemId));
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    persist(items.map(i => (i.id === itemId ? { ...i, quantity } : i)));
  }

  function clearCart() {
    persist([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce(
    (sum, i) => sum + (i.variant.price ?? i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
