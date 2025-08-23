import { api } from './axios';
import type { CreateJerseyRequest, Jersey } from '../types/seller';

export async function createJersey(payload: CreateJerseyRequest): Promise<Jersey> {
  const { data } = await api.post<Jersey>('/api/seller/jerseys', payload);
  return data;
}

export async function listJerseys(): Promise<Jersey[]> {
  const { data } = await api.get<Jersey[]>('/api/seller/jerseys');
  return data;
}

export async function updateJerseyPriceAndSizes(
  id: number,
  basePrice: number,
  discountedPrice: number | null | undefined,
  sizes: string[]
): Promise<Jersey> {
  const params = new URLSearchParams();
  params.set('basePrice', String(basePrice));
  if (discountedPrice !== undefined && discountedPrice !== null) {
    params.set('discountedPrice', String(discountedPrice));
  }
  sizes.forEach(s => params.append('sizes', s));
  const { data } = await api.put<Jersey>(`/api/seller/jerseys/${id}?${params.toString()}`);
  return data;
}

export async function deleteJersey(id: number): Promise<void> {
  await api.delete(`/api/seller/jerseys/${id}`);
}
