import axios, { AxiosError } from 'axios';
import { API_BASE } from '../constants/config';
//import { authBridge } from '../app/contexts/AuthContext';
import { auth } from '../app/contexts/authBridge';

// Axios instance for API calls
export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // not strictly necessary for localStorage flow, but safe if cookies used later
});

/**
 * Interceptor approach:
 * - Attach access token from authBridge (in-memory).
 * - On 401, attempt refresh using refresh token from localStorage.
 * - Retry original request once after refresh.
 */

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function onRefreshed(newAccessToken: string | null) {
  pendingRequests.forEach(cb => cb(newAccessToken));
  pendingRequests = [];
}

api.interceptors.request.use((config) => {
  const token = auth.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async (err: AxiosError) => {
    const originalConfig: any = err.config;
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (isRefreshing) {
        // queue and wait for refresh
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken) => {
            if (!newToken) return reject(err);
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalConfig));
          });
        });
      }

      try {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // no refresh token -> logout
          auth.logout();
          return Promise.reject(err);
        }

        const resp = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken }, { headers: { 'Content-Type': 'application/json' }});
        const data = resp.data as any; // { accessToken, refreshToken, ... }
        auth.setTokens(data.accessToken, data.refreshToken);
        onRefreshed(data.accessToken);
        originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalConfig);
      } catch (refreshErr) {
        auth.logout();
        onRefreshed(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);
