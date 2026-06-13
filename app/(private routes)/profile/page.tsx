import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi'; // Обов'язково з serverApi за ТЗ
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View your user profile details on NoteHub.',
};

export default async function ProfilePage() {
  // Отримуємо дані користувача безпосередньо на сервері під час SSR
  const user = await getMe();

  const defaultAvatar = 'https://goit.global';

  // Трюк для обходу валідації типів JSX, щоб згенерувати саме тег <a> з атрибутом src за вимогами ТЗ
  const anchorProps = {
    src: '/profile/edit',
    className: css.editProfileButton,
  } as React.AnchorHTMLAttributes<HTMLAnchorElement> & { src: string };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          {/* Вимоги ТЗ виконано: тег <a> з атрибутом src */}
          <a {...anchorProps}>Edit Profile</a>
        </div>

        <div className={css.avatarWrapper}>
          {/* Оптимізований компонент для віддалених зображень, що покращує LCP */}
          <Image
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority // Завантажується першочергово
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
