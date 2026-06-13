import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    // 🚀 ВИПРАВЛЕНО ДЛЯ TYPESCRIPT: якщо функція повернула null, переходимо в дефолтні метадані
    if (!note) {
      return {
        title: 'Note Not Found',
        description: 'The requested note could not be found or has been deleted.',
      };
    }

    return {
      title: note.title, // Автоматично підставиться в шаблон: "Назва нотатки | NoteHub"
      description: note.content.substring(0, 160) || 'Read this note on NoteHub.',
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160) || 'Detailed view of the note.',
        url: `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
        type: 'article',
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Note Not Found',
      description: 'The requested note could not be found or has been deleted.',
    };
  }
}

// 🚀 2. Серверний компонент (SSR), який завантажує дані перед рендером
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  let initialData = null;

  try {
    initialData = await fetchNoteById(id);

    // 🚀 ВИПРАВЛЕНО ДЛЯ TYPESCRIPT ТА БЕЗПЕКИ: якщо нотатки немає на бекенді (null) —
    // викликаємо вбудовану функцію notFound() для відображення 404 сторінки
    if (!initialData) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <main>
      {/* Передаємо завантажені на сервері дані (SSR) у клієнтський компонент (CSR) */}
      <NoteDetailsClient initialData={initialData} id={id} />
    </main>
  );
}
