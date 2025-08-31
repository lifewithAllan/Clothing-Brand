import { api } from './axiosClient';
import type { LoginRequest, SignupRequest, AuthResponse } from '../types/auth';
import { API_BASE, FRONTEND_BASE } from '../constants/config';

// login used by both buyer + seller fronts (same endpoint)
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/buyer/login', payload);
  return data;
}

// request signup (email only)
export async function requestSignup(payload: SignupRequest) {
  // backend expects X-FRONTEND-BASE-URL header (we added this pattern earlier)
  await api.post('/api/auth/buyer/buyer-request-signup', payload, {
    headers: { 'X-FRONTEND-BASE-URL': import.meta.env.VITE_FRONTEND_BASE ?? FRONTEND_BASE }
  });
}

// forgot password (buyer)
export async function requestPasswordReset(email: string) {
  await api.post('/api/buyer/account/forgot-password', { email });
}

export async function completePasswordReset(token: string, newPassword: string) {
  await api.post('/api/buyer/account/reset-password', { token, newPassword });
}

// request account deletion (sends email)
export async function requestDeleteAccount(email: string) {
  await api.post('/api/buyer/account/request-delete', { email });
}
