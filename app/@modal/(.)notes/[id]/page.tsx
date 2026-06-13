import React from 'react';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

// 1. Обов'язкова типізація асинхронних params для Next.js 16 за вимогою ментора
interface NoteModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePreviewModalPage({ params }: NoteModalPageProps) {
  // 2. Отримуємо id з асинхронних параметрів маршруту на сервері
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

  // 3. Створюємо екземпляр QueryClient на сервері
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  // 4. Попередньо отримуємо дані нотатки на сервері (prefetchQuery)
  // Використовуємо стрічковий ключ та ідентифікатор в queryKey, а в queryFn - fetchNoteById
  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    // 5. Передаємо наперед отримані дані у клієнтський компонент через HydrationBoundary та dehydrate
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
