import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // ПРАВИЛЬНО: Інвалідуємо всі ключі, які починаються з 'notes'
      queryClient.invalidateQueries({
        queryKey: ['notes'],
        exact: false,
      });
    },
  });

  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

            {}
            <a href={`/notes/${id}`} className={css.link}>
              View details
            </a>

            <button
              className={css.button}
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(id)}
            >
              {deleteMutation.isPending ? '...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
