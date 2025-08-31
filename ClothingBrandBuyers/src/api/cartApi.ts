import { api } from './axiosClient';
import type { CartItemRequest, CartItem } from '../types/cart';

export async function addToCart(payload: CartItemRequest) {
  const { data } = await api.post<CartItem>('/api/buyer/cart', payload);
  return data;
}

export async function listCart() {
  const { data } = await api.get<CartItem[]>('/api/buyer/cart');
  return data;
}

export async function updateCartItem(id: string, payload: CartItemRequest) {
  const { data } = await api.put<CartItem>(`/api/buyer/cart/${id}`, payload);
  return data;
}

export async function deleteCartItem(id: string) {
  await api.delete(`/api/buyer/cart/${id}`);
}

export async function clearCart() {
  await api.delete('/api/buyer/cart');
}
