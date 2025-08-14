const REFRESH_KEY = 'refreshToken';

export const storage = {
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    localStorage.removeItem(REFRESH_KEY);
  },
};
