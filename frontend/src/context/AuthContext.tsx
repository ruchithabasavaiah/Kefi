'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { apiLogin, apiRegister } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kefi_token');
    const storedUser = localStorage.getItem('kefi_user');
    if (stored && storedUser) {
      setToken(stored);
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        // ignore
      }
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await apiLogin(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('kefi_token', res.token);
    localStorage.setItem('kefi_user', JSON.stringify(res.user));
  }

  async function signup(email: string, password: string) {
    const res = await apiRegister(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('kefi_token', res.token);
    localStorage.setItem('kefi_user', JSON.stringify(res.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kefi_token');
    localStorage.removeItem('kefi_user');
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
