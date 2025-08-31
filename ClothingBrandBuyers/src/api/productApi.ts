import { api } from './axiosClient';
import type { Product } from '../types/product';

export async function listProducts(q?: string): Promise<Product[]> {
  const url = q ? `/api/buyer/products?q=${encodeURIComponent(q)}` : '/api/buyer/products';
  const { data } = await api.get<Product[]>(url);
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/api/buyer/products/${id}`);
  return data;
}
