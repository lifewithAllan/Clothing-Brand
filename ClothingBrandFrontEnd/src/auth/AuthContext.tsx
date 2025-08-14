import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import type { AuthResponse, LoginRequest } from '../types';
import axios from 'axios';
import { auth } from './authBridge';

type AuthContextShape = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const internalSetTokens = useCallback((access: string, refresh: string) => {
    setAccessToken(access);
    auth.setAccessToken(access);
    storage.setRefreshToken(refresh);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const { data } = await axios.post<AuthResponse>(
      `${import.meta.env.VITE_API_BASE}/api/auth/login`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    internalSetTokens(data.accessToken, data.refreshToken);
  }, [internalSetTokens]);

  const logout = useCallback(() => {
    const refreshToken = storage.getRefreshToken();
    // best-effort logout (ignore errors)
    if (refreshToken) {
      axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/logout`, { refreshToken }).catch(() => void 0);
    }
    setAccessToken(null);
    auth.setAccessToken(null);
    storage.clear();
  }, []);

  // bind AuthBridge with current state mutators
  useEffect(() => {
    auth.setAccessToken(accessToken);
    auth.logout = () => logout();
    auth.setTokens = (a, r) => internalSetTokens(a, r);
  }, [accessToken, logout, internalSetTokens]);

  // On app start: if refresh token exists, try to refresh to initialize session
  useEffect(() => {
    const init = async () => {
      const refresh = storage.getRefreshToken();
      if (!refresh) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.post<AuthResponse>(
          `${import.meta.env.VITE_API_BASE}/api/auth/refresh`,
          { refreshToken: refresh }
        );
        internalSetTokens(data.accessToken, data.refreshToken);
      } catch {
        storage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [internalSetTokens]);

  const value = useMemo<AuthContextShape>(() => ({
    isLoading,
    isAuthenticated: !!accessToken,
    accessToken,
    login,
    logout,
    setTokens: internalSetTokens,
  }), [isLoading, accessToken, login, logout, internalSetTokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};