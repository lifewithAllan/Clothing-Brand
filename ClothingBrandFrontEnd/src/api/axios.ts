import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import type { AuthResponse } from '../types';
import { auth } from '../auth/AuthContext';

// Create a singleton axios instance for API calls
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from AuthContext for each request
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = auth.getAccessToken(); // read current in-memory token
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401 and retry once
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function onRefreshed(newAccessToken: string) {
  pendingRequests.forEach((cb) => cb(newAccessToken));
  pendingRequests = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // if unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token: string) => {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      try {
        isRefreshing = true;

        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          auth.logout(); // no refresh token, force logout
          return Promise.reject(error);
        }

        const { data } = await axios.post<AuthResponse>(
          `${import.meta.env.VITE_API_BASE}/api/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // update tokens globally
        auth.setTokens(data.accessToken, data.refreshToken);
        onRefreshed(data.accessToken);

        // retry original request with new access token
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        auth.logout(); // refresh failed
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
}
);