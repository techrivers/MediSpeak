"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email?: string; name?: string } | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth state from localStorage or a cookie
    const storedUser = localStorage.getItem('SpeakBridgeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/' || pathname === '/forgot-password' || pathname === '/privacy-policy' || pathname === '/terms-of-service';
      if (!user && !isAuthPage) {
        router.push('/');
      } else if (user && isAuthPage && pathname !== '/privacy-policy' && pathname !== '/terms-of-service') {
         // if user is logged in and on login/forgot-password, redirect to dashboard
        if (pathname === '/' || pathname === '/forgot-password') {
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, router, pathname]);

  const login = (email: string, name: string = "Doctor") => {
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('SpeakBridgeUser', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('SpeakBridgeUser');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
