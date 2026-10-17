import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from './config';

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  /** true when the email is in ADMIN_EMAILS on the server */
  isAdmin?: boolean;
  createdAt: string;
}

export interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T & { success?: boolean; message?: string; code?: string };
}

const TOKEN_KEY = 'hz_customer_token';

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

/** Small fetch wrapper for our JSON API. Never throws - network errors come back as ok:false. */
export async function apiRequest<T = any>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || (options.body ? 'POST' : 'GET'),
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.success !== false, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { success: false, message: 'Cannot reach the server. Check your internet connection and try again.' } as any
    };
  }
}

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  /** true while the saved session is being checked on page load */
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResult>;
  logout: () => void;
  /** Swap in a fresh token (e.g. after a password change revokes the old one) */
  replaceToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(readToken);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(!!readToken());

  const saveToken = (value: string | null) => {
    try {
      if (value) localStorage.setItem(TOKEN_KEY, value);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage blocked - session lasts for this tab only
    }
    setToken(value);
  };

  // Restore the session on load; drop it if the server says it's no longer valid
  useEffect(() => {
    if (!token) {
      setCustomer(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    apiRequest<{ customer: Customer }>('/api/auth/me', { token }).then((res) => {
      if (cancelled) return;
      if (res.ok) setCustomer(res.data.customer);
      else if (res.status === 401) {
        saveToken(null);
        setCustomer(null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest<{ token: string; customer: Customer }>('/api/auth/login', {
      body: { email, password }
    });
    if (res.ok) {
      setCustomer(res.data.customer);
      saveToken(res.data.token);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    saveToken(null);
    setCustomer(null);
  }, []);

  const replaceToken = useCallback((value: string) => saveToken(value), []);

  return (
    <AuthContext.Provider value={{ customer, token, loading, login, logout, replaceToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
