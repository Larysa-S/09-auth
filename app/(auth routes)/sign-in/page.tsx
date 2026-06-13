'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { login } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore'; // 🌟 Імпортуємо стор
import css from '@/components/SignInPage/SignInPage.module.css';

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser); // 🌟 Беремо метод запису користувача
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userData = await login({ email, password });

      setUser(userData); // 🌟 Зберігаємо користувача в Zustand після успішного входу
      router.push('/profile');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | undefined;
        setError(responseData?.message || 'Invalid email or password.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
