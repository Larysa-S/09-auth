'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  // Беремо реальний стан та метод очищення зі створеного Zustand-стору
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
    } catch (err: unknown) {
      console.error('Logout request failed:', err);
    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
    }
  };

  // 🚀 ВИПРАВЛЕНО: Замість return null рендеримо дефолтні посилання для гостя.
  // Це рятує геометрію і флекс-сітку хедера від руйнування при першому рендері!
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
            <button className={css.logoutButton} onClick={handleLogout}>
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
