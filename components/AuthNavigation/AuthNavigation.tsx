'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  // Деструктуризація дефолтного стору працює без помилок implicit any
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // 🚀 ВИПРАВЛЕНО: Очищаємо стан та робимо редірект ТІЛЬКИ у разі успішного видалення сесії на бекенді
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (err: unknown) {
      console.error('Logout request failed:', err);
      // Якщо сталася помилка, можна додати сповіщення для користувача,
      // але головне — ми не ламаємо його поточну сесію локально.
    }
  };

  // Посилання для гостя за замовчуванням під час гідрації
  if (!isClient) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email || 'User email'}</p>
            {/* 🚀 ВИПРАВЛЕНО: Додано обов'язковий атрибут type="button" */}
            <button type="button" className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
