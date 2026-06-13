import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// Імпортуємо тільки необхідні серверні утиліти для гідратації
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

// 🚀 1. Динамічні метадані сторінки (виконуються на сервері)
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    if (!note) {
      return {
        title: 'Note Not Found',
        description: 'The requested note could not be found or has been deleted.',
      };
    }

    return {
      title: note.title,
      description: note.content.substring(0, 160) || 'Read this note on NoteHub.',
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content.substring(0, 160) || 'Detailed view of the note.',
        url: `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
        type: 'article',
        images: [
          {
            url: 'https://goit.global',
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

// 🏛️ 2. Серверний компонент сторінки (SSR)
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  // Валідація наявності нотатки для виклику 404 сторінки
  try {
    const checkNote = await fetchNoteById(id);
    if (!checkNote) {
      notFound();
    }
  } catch {
    notFound();
  }

  // Створюємо серверний клієнт React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  // Префетчимо дані під ключем ['note', id] за вимогами ментора
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <main style={{ padding: '40px 20px' }}>
      {/* Передаємо дегідратований стан клієнтському компоненту */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Передаємо ТІЛЬКИ id. Дані компонент забере сам із кешу */}
        <NoteDetailsClient id={id} />
      </HydrationBoundary>
    </main>
  );
}
