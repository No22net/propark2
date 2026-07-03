'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { AuthAPI } from '@/lib/services';
import { setToken, getToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, captcha?: { token: string; answer: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; captcha?: { token: string; answer: string } }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بازیابی نشست از روی توکن ذخیره‌شده
  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const res = await AuthAPI.me();
    if (res.success && res.data) setUser(res.data);
    else { setToken(null); setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string, captcha?: { token: string; answer: string }) => {
    const res = await AuthAPI.login(email, password, captcha);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'خطا در ورود' };
  };

  const register = async (data: { name: string; email: string; password: string; captcha?: { token: string; answer: string } }) => {
    const res = await AuthAPI.register(data);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'خطا در ثبت‌نام' };
  };

  const logout = async () => {
    try { await AuthAPI.logout(); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      loading,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
