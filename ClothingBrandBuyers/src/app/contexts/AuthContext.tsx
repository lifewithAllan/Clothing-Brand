import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AuthResponse, LoginRequest } from '../../types/auth';
import axios from 'axios';
import { API_BASE } from '../../constants/config';
import { auth } from './authBridge';

type AuthContextType = {
  accessToken: string | null;
  user?: { firstName: string } | null;
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

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Utility: decode JWT expiry
  const getExpiry = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // exp is in seconds → ms
    } catch {
      return null;
    }
  };

  // Utility: schedule refresh before expiry
  const scheduleRefresh = useCallback(
    (access: string, refresh: string) => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

      const expiry = getExpiry(access);
      if (!expiry) return;

      const now = Date.now();
      const refreshAt = expiry - 60_000; // 1 min before expiry
      const delay = Math.max(refreshAt - now, 5_000); // minimum 5s

      refreshTimerRef.current = setTimeout(async () => {
        try {
          const { data } = await axios.post<AuthResponse>(
            `${API_BASE}/api/auth/buyer/refresh`,
            { buyerRefreshToken: refresh }
          );
          internalSetTokens(data.accessToken, data.refreshToken);
        } catch (err) {
          console.warn('Auto-refresh failed, logging out');
          logout();
        }
      }, delay);
    },
    []
  );

  const internalSetTokens = useCallback(
    (access: string, refresh: string) => {
      setAccessToken(access);
      auth.setAccessToken(access);
      if (refresh) localStorage.setItem('refreshToken', refresh);

      // decode user info
      try {
        const payload = JSON.parse(atob(access.split('.')[1]));
        setUser({ email: payload.sub ?? payload.email ?? '' });
      } catch {
        setUser(null);
      }

      // schedule auto refresh
      if (access && refresh) {
        scheduleRefresh(access, refresh);
      }
    },
    [scheduleRefresh]
  );

  // login
  const login = useCallback(
    async (payload: LoginRequest) => {
      const { data } = await axios.post<AuthResponse>(
        `${API_BASE}/api/auth/buyer/login`,
        payload
      );
      internalSetTokens(data.accessToken, data.refreshToken);
    },
    [internalSetTokens]
  );

  const requestSignup = useCallback(async (email: string) => {
    await axios.post(
      `${API_BASE}/api/auth/buyer/buyer-request-signup`,
      { email },
      {
        headers: {
          'X-FRONTEND-BASE-URL':
            import.meta.env.VITE_FRONTEND_BASE ?? 'http://localhost:5173',
        },
      }
    );
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await axios.post(`${API_BASE}/api/buyer/account/forgot-password`, {
      email,
    });
  }, []);

  // logout
  const logout = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      axios
        .post(`${API_BASE}/api/auth/buyer/logout`, { refreshToken })
        .catch(() => {});
    }
    setAccessToken(null);
    auth.setAccessToken(null);
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // on mount, try refresh
  useEffect(() => {
    const init = async () => {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE}/api/auth/buyer/refresh`,
          { buyerRefreshToken: refresh }
        );
        internalSetTokens(data.accessToken, data.refreshToken);
      } catch {
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    init();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [internalSetTokens]);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isLoading,
      isAuthenticated: !!accessToken,
      login,
      logout,
      requestSignup,
      requestPasswordReset,
      setTokens: internalSetTokens,
    }),
    [
      accessToken,
      user,
      isLoading,
      login,
      logout,
      requestSignup,
      requestPasswordReset,
      internalSetTokens,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
