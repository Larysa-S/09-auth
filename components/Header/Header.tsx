import React from 'react';
import Link from 'next/link';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      {/* ПРАВИЛЬНО: Додаємо клас css.headerLink для логотипа */}
      <Link href="/" aria-label="Home" className={css.headerLink}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          {/* ПРАВИЛЬНО: Додаємо клас css.navigationItem для елемента списку */}
          <li className={css.navigationItem}>
            {/* ПРАВИЛЬНО: Додаємо клас css.navigationLink для посилання */}
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>
          <li className={css.navigationItem}>
            {/* ПРАВИЛЬНО: Додаємо клас css.navigationLink для посилання */}
            <Link href="/notes/filter/all" className={css.navigationLink}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
