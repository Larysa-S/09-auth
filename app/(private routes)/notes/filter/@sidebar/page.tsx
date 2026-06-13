import React from 'react';
import css from './SideBar.module.css'; // Чітко з великою літерою B

const TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function SidebarNotesPage() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <a href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </a>
      </li>
      {TAGS.map(tag => (
        <li key={tag} className={css.menuItem}>
          <a href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </a>
        </li>
      ))}
    </ul>
  );
}
