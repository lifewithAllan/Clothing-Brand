import { api } from './axiosClient';
import type { CheckoutRequest } from '../types/checkout';

export async function checkout(payload: CheckoutRequest) {
  const { data } = await api.post('/api/buyer/checkout', payload);
  return data; // { reference, status }
}
