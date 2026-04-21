import { Product, AuthResponse, Order, CheckoutResponse } from '@/types';
import { getToken } from './utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Auth
export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetMe(): Promise<{ user: import('@/types').User }> {
  return request('/auth/me');
}

// Products
export async function apiGetProducts(): Promise<Product[]> {
  return request<Product[]>('/products');
}

export async function apiGetProduct(id: string): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export async function apiGetVariants(productId: string): Promise<import('@/types').ProductVariant[]> {
  return request(`/products/${productId}/variants`);
}

// Checkout
export async function apiCheckout(items: { variantId: string; quantity: number }[]): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('/checkout', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

// Orders
export async function apiGetOrders(): Promise<Order[]> {
  return request<Order[]>('/me/orders');
}
