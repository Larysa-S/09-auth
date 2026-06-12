import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

// 🚀 1. Динамічне опрацювання SEO через generateMetadata (Вимога ментора)
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: note.title, // Автоматично підставиться в шаблон: "Назва нотатки | NoteHub"
      description: note.content.substring(0, 160) || 'Read this note on NoteHub.',
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160) || 'Detailed view of the note.',
        url: `https://08-zustand-wbtm-pqo1qoes5-larysa-s-projects-0c81aa0e.vercel.app/notes/${id}`,
        type: 'article',
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          },
        ],
      },
    };
  } catch (error) {
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
  } catch (error) {
    console.error('Failed to fetch note for SSR:', error);
    notFound();
  }

  return (
    <main>
      {/* Передаємо завантажені на сервері дані (SSR) у клієнтський компонент (CSR) */}
      <NoteDetailsClient initialData={initialData} id={id} />
    </main>
  );
}
