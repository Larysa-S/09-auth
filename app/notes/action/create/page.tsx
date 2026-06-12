import React from 'react';
import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Create Note',
  description:
    'Створюйте нові записи, структуруйте думки та зберігайте важливу інформацію в NoteHub.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Зручна форма для створення нових нотаток у реальному часі.',
    // 🔥 ВИПРАВЛЕНО: додано справжню канонічну URL-адресу цієї сторінки
    url: 'https://08-zustand-wbtm-pqo1qoes5-larysa-s-projects-0c81aa0e.vercel.app/notes/action/create',
    type: 'website',
    images: [
      {
        // 🔥 ВИПРАВЛЕНО: встановлено пряме посилання на файл зображення з розширенням .jpg строго за ТЗ
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
