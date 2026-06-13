'use client';

import React, { useEffect } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🚀 Робимо один прямий запит до /users/me через checkSession
        const userData = await checkSession();

        if (userData) {
          setUser(userData); // Якщо користувач є — записуємо його в Zustand
        } else {
          clearIsAuthenticated(); // Якщо повернувся null (гість) — скидаємо стан
        }
      } catch {
        clearIsAuthenticated(); // Безпечно розлогінюємо у разі збою мережі
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  // 🚀 Рендеримо контент додатка відразу. Навігація миттєво покаже
  // кнопки Login/Sign up без затримок, крашів розширення та каскадних рендерів!
  return <>{children}</>;
}
