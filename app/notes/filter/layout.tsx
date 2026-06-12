import React from 'react';
import css from './LayoutNotes.module.css';

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode; // Залишаємо тільки сайдбар, як вимагає ментор
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={css.container}>
      {/* Ліва колонка: темний сайдбар із тегами */}
      <aside className={css.sidebar}>{sidebar}</aside>

      {/* Права колонка: список нотаток */}
      <main className={css.notesWrapper}>{children}</main>
    </div>
  );
}
