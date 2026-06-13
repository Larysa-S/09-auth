'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
// Імпортуємо вашу реальну функцію та даємо їй локальний аліас, щоб не плутати
import { fetchNoteById as fetchNoteClient } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  // Використовуємо useQuery з ідентичним до сервера ключем ['note', id]
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteClient(id), // викликаємо імпортовану клієнтську функцію
    staleTime: 60 * 1000,
  });

  if (isLoading) return <div>Loading note...</div>;
  if (isError || !note) return <div>Error loading note.</div>;

  return (
    <div className={css.container}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      {note.tag && <span className={css.tag}>{note.tag}</span>}
    </div>
  );
}
