'use client';

import React, { useEffect, useState } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';
import axios from 'axios';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  // Локальний стан завантаження, щоб додаток не миготів, поки йде перевірка
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Перевіряємо, чи є активна сесія в куках
        const session = await checkSession();

        // Якщо сесія є, робимо запит на отримання повних даних профілю
        if (session) {
          const userData = await getMe();
          setUser(userData); // Записуємо користувача в Zustand стор
        } else {
          clearIsAuthenticated(); // Якщо сесія порожня — очищаємо стор
        }
      } catch (err: unknown) {
        console.error('Session verification failed:', err);
        clearIsAuthenticated(); // У разі помилки безпечно розлогінюємо
      } finally {
        setIsRefreshing(false); // Завершуємо процес перевірки
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  // Поки йде перевірка кук, можна показати простий Loader, щоб закриті сторінки не миготіли
  if (isRefreshing) {
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
