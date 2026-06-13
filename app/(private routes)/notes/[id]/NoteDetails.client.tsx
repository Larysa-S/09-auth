'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteDetails.client.module.css';

// 1. ВИПРАВЛЕНО: Робимо initialData НЕОБОВ'ЯЗКОВИМ (додано знак ?), щоб прибрати помилку білду
interface NoteDetailsClientProps {
  initialData?: Note | null; // <-- знак ? вирішує проблему з <NoteDetailsClient id={id} />
  id: string;
}

export default function NoteDetailsClient({ initialData, id }: NoteDetailsClientProps) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    initialData: initialData ?? undefined,
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

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
