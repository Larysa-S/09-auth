'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // 🚀 ДОДАНО: Імпортуємо Link для переходу
import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import EmptyState from '@/components/EmptyState/EmptyState';

import css from './Notes.client.module.css';

const PER_PAGE = 12;

interface NotesClientProps {
  currentTag: string;
}

export default function NotesClient({ currentTag }: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = Number(searchParams.get('page')) || 1;
  const urlSearch = searchParams.get('search') || '';

  const [localSearch, setLocalSearch] = useState<string>(urlSearch);

  // 🚀 ВИДАЛЕНО: Стейт модалки нам більше не потрібен за ТЗ ментора

  const updateUrl = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newSearch.trim()) params.set('search', newSearch.trim());

    router.push(`/notes/filter/${currentTag}?${params.toString()}`);
  };

  const debouncedUpdateUrl = useDebouncedCallback((value: string) => {
    updateUrl(1, value);
  }, 500);

  const handleSearchChange = (value: string): void => {
    setLocalSearch(value);
    debouncedUpdateUrl(value);
  };

  const handleClearSearch = (): void => {
    setLocalSearch('');
    updateUrl(1, '');
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['notes', urlPage, urlSearch, currentTag],
    queryFn: () =>
      fetchNotes({ page: urlPage, perPage: PER_PAGE, search: urlSearch, tag: currentTag }),
    placeholderData: previousData => previousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ? Number(data.totalPages) : 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox key={urlSearch} value={localSearch} onChange={handleSearchChange} />

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            currentPage={urlPage}
            totalPages={totalPages}
            onPageChange={p => updateUrl(p, urlSearch)}
          />
        )}

        {/* 🚀 ВИПРАВЛЕНО: Кнопка перетворена на посилання на окремий маршрут строго за ТЗ ментора */}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <div>
        {isLoading && <Loader message="Fetching your notes from NoteHub..." />}

        {isError && (
          <ErrorMessage message="Failed to load notes. Check your token." onRetry={refetch} />
        )}

        {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

        {!isLoading && !isError && notes.length === 0 && (
          <EmptyState isSearchActive={urlSearch.length > 0} onClearSearch={handleClearSearch} />
        )}
      </div>
    </div>
  );
}
