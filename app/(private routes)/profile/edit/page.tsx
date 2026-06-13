'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import useAuthStore from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';
import css from './page.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Loading profile data...</p>
      </main>
    );
  }

  const defaultAvatar = 'https://goit.global';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | undefined;
        setError(responseData?.message || 'Failed to update profile.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || defaultAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={css.input}
              disabled={isLoading}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className={css.error} style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
