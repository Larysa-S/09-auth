import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import Loader from '@/components/Loader/Loader';

// 1. Спільний інтерфейс для пропсів сторінки фільтрації
interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

// 🚀 2. Динамічне опрацювання SEO через generateMetadata (Вимога ментора)
export async function generateMetadata({
  params,
}: Pick<FilterPageProps, 'params'>): Promise<Metadata> {
  const { slug } = await params;
  const activeFilter = slug ? slug.join(' / ') : 'all';

  return {
    title: `Фільтр: ${activeFilter}`,
    description: `Перегляд нотаток, відфільтрованих за параметром: ${activeFilter}. Зручна організація записів на NoteHub.`,
    openGraph: {
      title: `Нотатки за фільтром: ${activeFilter} | NoteHub`,
      description: `Усі ваші особисті записи, знайдені за критерієм: ${activeFilter}.`,
      url: `https://08-zustand-wbtm-pqo1qoes5-larysa-s-projects-0c81aa0e.vercel.app/notes/filter/${slug ? slug.join('/') : ''}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

// 🏛️ 3. Єдиний серверний компонент (SSR) з логікем префетчингу та гідрації TanStack Query
export default async function FilteredNotesPage({ params, searchParams }: FilterPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Дістаємо перший елемент з масиву slug (наприклад, 'all', 'Work' або 'Personal')
  const currentTag = resolvedParams.slug?.[0] || 'all';

  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const search = resolvedSearchParams.search ?? '';
  const perPage = 12;

  // Створюємо клієнт для серверного префетчингу
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  // Передаємо currentTag у ключ кешу та як параметр фільтрації для API запиту
  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search, currentTag],
    queryFn: () => fetchNotes({ page, perPage, search, tag: currentTag }),
  });

  return (
    <main style={{ padding: '40px 20px' }}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loader message="Filtering your notes..." />}>
          {/* Передаємо поточний тег у клієнтський компонент за ТЗ */}
          <NotesClient currentTag={currentTag} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
