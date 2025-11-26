import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import * as authApi from '../api/authApi';

type User = {
  id?: number;
  email?: string;
  is_active?: boolean;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);
  // module-level guard to avoid concurrent network initialization across remounts
  // (persists while the page is loaded)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  ;(globalThis as any).__authInitInProgress = (globalThis as any).__authInitInProgress || false;

  useEffect(() => {
    // Prevent double invocation in React.StrictMode during development
    if (initialized.current) return;
    initialized.current = true;

    // Avoid concurrent getMe calls across remounts
    if ((globalThis as any).__authInitInProgress) {
      console.debug('Auth init already in progress, skipping duplicate getMe');
      setLoading(false);
      return;
    }

    // If the client already marked auth invalid (failed refresh), skip probing.
    if (typeof window !== 'undefined' && (window as any).__authInvalid) {
      console.debug('Auth previously marked invalid, skipping getMe');
      setLoading(false);
      return;
    }

    // Only probe if a refresh token cookie exists — avoids unnecessary network calls for anonymous visitors.
    if (typeof document !== 'undefined' && !document.cookie.includes('refresh_token=')) {
      console.debug('No refresh_token cookie present, skipping getMe');
      setLoading(false);
      return;
    }

    // Short-circuit repeated attempts: if we tried recently, skip to avoid flooding the server.
    const lastAttempt = (globalThis as any).__lastAuthAttempt || 0;
    const now = Date.now();
    if (now - lastAttempt < 5000) {
      console.debug('Recent auth init detected, skipping getMe to avoid flood');
      setLoading(false);
      return;
    }

    (globalThis as any).__authInitInProgress = true;
    (globalThis as any).__lastAuthAttempt = now;

    console.debug('Calling authApi.getMe()');
    authApi.getMe()
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        (globalThis as any).__authInitInProgress = false;
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.data);
  };

  const register = async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    setUser(response.data);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
