import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse, LoginRequest } from '../../types/auth';
import axios from 'axios';
import { API_BASE } from '../../constants/config';
import { auth } from './authBridge';

/* Small bridge to allow axiosClient to access tokens (we import the bridge in axiosClient)
class AuthBridgeClass {
  private _accessToken: string | null = null;
  getAccessToken() { return this._accessToken; }
  setAccessToken(token: string | null) { this._accessToken = token; }
  logout = () => {};
  setTokens = (_a: string, _r: string) => {};
}
export const authBridge = new AuthBridgeClass();*/

type AuthContextType = {
  accessToken: string | null;
  user?: { email: string; firstName: string; lastName: string; } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  requestSignup: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // bind bridge
  useEffect(() => {
    auth.setAccessToken = (t: string | null) => setAccessToken(t);
    auth.getAccessToken = () => accessToken;
    auth.logout = () => logout();
    auth.setTokens = (a, r) => internalSetTokens(a, r);
  }, [accessToken]);

  const internalSetTokens = useCallback((access: string, refresh: string) => {
    setAccessToken(access);
    auth.setAccessToken(access);
    if (refresh) localStorage.setItem('refreshToken', refresh);
    // Optionally decode access token for user info here. For simplicity we store email from token if provided:
    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      setUser({ email: payload.sub ?? payload.email ?? '' });
    } catch {
      setUser(null);
    }
  }, []);

  // login
  const login = useCallback(async (payload: LoginRequest) => {
    const { data } = await axios.post<AuthResponse>(`${API_BASE}/api/auth/buyer/login`, payload);
    internalSetTokens(data.accessToken, data.refreshToken);
  }, [internalSetTokens]);

  // request signup
  const requestSignup = useCallback(async (email: string) => {
    await axios.post(`${API_BASE}/api/auth/buyer/buyer-request-signup`, { email }, {
      headers: { 'X-FRONTEND-BASE-URL': import.meta.env.VITE_FRONTEND_BASE ?? 'http://localhost:5173' },
    });
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await axios.post(`${API_BASE}/api/buyer/account/forgot-password`, { email });
  }, []);

  // logout
  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      axios.post(`${API_BASE}/api/auth/buyer/logout`, { refreshToken }).catch(() => {});
    }
    setAccessToken(null);
    auth.setAccessToken(null);
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // on mount try to refresh using existing refresh token
  useEffect(() => {
    const init = async () => {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.post<AuthResponse>(`${API_BASE}/api/auth/buyer/refresh`, { refreshToken: refresh });
        internalSetTokens(data.accessToken, data.refreshToken);
      } catch {
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [internalSetTokens]);

  const value = useMemo(() => ({
    accessToken,
    user,
    isLoading,
    isAuthenticated: !!accessToken,
    login,
    logout,
    requestSignup,
    requestPasswordReset,
    setTokens: internalSetTokens,
  }), [accessToken, user, isLoading, login, logout, requestSignup, requestPasswordReset, internalSetTokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
