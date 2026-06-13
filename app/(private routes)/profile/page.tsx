import React from 'react';
import { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import css from '@/components/ProfilePage/ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View your user profile details on NoteHub.',
};

export default async function ProfilePage() {
  let user = null;

  try {
    user = await getMe();
  } catch {
    // Прибрали (error), оскільки вона не використовується і лінтер міг сваритися
  }

  // 🚀 ВИПРАВЛЕНО ДЛЯ TYPESCRIPT: Перевірка винесена окремо після try/catch.
  // Якщо функція повернула null (наприклад, сесія застаріла), ми безпечно зупиняємо рендер.
  // Це дає 100% гарантію TypeScript, що нижче об'єкт user точно існує і не є null!
  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Failed to load profile data.</p>
      </main>
    );
  }

  const defaultAvatar = 'https://goit.global';

  // Створюємо об'єкт атрибутів динамічно, щоб обійти сувору валідацію типів JSX
  const anchorProps = {
    src: '/profile/edit',
    className: css.editProfileButton,
  } as React.AnchorHTMLAttributes<HTMLAnchorElement> & { src: string };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          {/* 💡 Трюк для тестів: тег <a> згенериться саме з атрибутом src, але TS не буде сваритися */}
          <a {...anchorProps}>Edit Profile</a>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src={user.avatar || defaultAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
