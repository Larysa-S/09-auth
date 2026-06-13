import React, { Suspense } from 'react'; // 🚀 ДОДАНО Suspense
import Link from 'next/link';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      {/* ПРАВИЛЬНО: Клас css.headerLink для логотипа */}
      <Link href="/" aria-label="Home" className={css.headerLink}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          {/* ПРАВИЛЬНО: Клас css.navigationItem для елементів списку */}
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/notes/filter/all" className={css.navigationLink}>
              Notes
            </Link>
          </li>

          {/* 🚀 ВИПРАВЛЕНО ДЛЯ REACT DEV TOOLS BUG: 
              Огортаємо компонент авторизації в ізольований Suspense Boundary.
              Це повністю прибирає помилку "cleaning up async info" у консолі! */}
          <Suspense fallback={null}>
            <AuthNavigation />
          </Suspense>
        </ul>
      </nav>
    </header>
  );
}
