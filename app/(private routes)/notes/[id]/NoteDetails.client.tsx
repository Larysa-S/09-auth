'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteDetails.client.module.css';

// 1. Інтерфейс для пропсів, що прибирає помилку IntrinsicAttributes у серверному page.tsx
interface NoteDetailsClientProps {
  initialData: Note | null;
  id: string;
}

export default function NoteDetailsClient({ initialData, id }: NoteDetailsClientProps) {
  // 2. Налаштування TanStack Query з урахуванням SSR даних та вимоги refetchOnMount
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    initialData: initialData ?? undefined, // Інтегруємо SSR дані, щоб сторінка відкривалася миттєво
    refetchOnMount: false, // Обов'язковий рядок за вимогою ментора
  });

  // 3. Опрацювання стану isLoading за технічним завданням ментора
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  // 4. Опрацювання помилки за технічним завданням ментора
  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  // 5. Успішна розмітка картки детального перегляду з вашого другого варіанту
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
