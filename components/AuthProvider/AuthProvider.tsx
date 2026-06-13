'use client';

import React, { useEffect, useState } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Витягуємо методи через деструктуризацію для уникнення помилки implicit any
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await checkSession();
        if (userData) {
          setUser(userData);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  // Захист від блимання інтерфейсу під час перевірки сесії
  if (isInitializing) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <p>Loading session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
