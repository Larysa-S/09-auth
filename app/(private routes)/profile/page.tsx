import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link'; // 🚀 ВИПРАВЛЕНО: Імпортуємо правильний компонент Link для навігації
import { getMe } from '@/lib/api/serverApi';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View your user profile details on NoteHub.',
};

export default async function ProfilePage() {
  // Отримуємо дані користувача безпосередньо на сервері під час SSR
  const user = await getMe();

  const defaultAvatar = 'https://goit.global';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          {/* 🚀 ВИПРАВЛЕНО: Замінено тег <a> на <Link> з атрибутом href строго за конвенціями Next.js */}
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority // Завантажується першочергово для ідеального LCP
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
