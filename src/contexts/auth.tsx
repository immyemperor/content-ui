'use client';

import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';

import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear any partial data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [router]);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
