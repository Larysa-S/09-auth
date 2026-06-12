'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '../../lib/store/noteStore';
import type { NoteCategory } from '@/types/note';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Локальний прапорець для безпечного контролю гідратації з localStorage
  const [mounted, setMounted] = useState(false);
  const { draft, setDraft, clearDraft } = useNoteStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
    onError: error => {
      console.error('Failed to create note:', error);
      alert('Something went wrong while creating the note.');
    },
  });

  const handleFormAction = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as NoteCategory;

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    mutation.mutate({ title, content, tag });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  // Безпечні початкові значення для запобігання Hydration Mismatch
  const displayTitle = mounted ? draft.title : '';
  const displayContent = mounted ? draft.content : '';
  const displayTag = mounted ? draft.tag : 'Todo';

  return (
    <form action={handleFormAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={displayTitle}
          onChange={e => setDraft({ title: e.target.value })}
          className={css.input}
          placeholder="Enter note title..."
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Category / Tag</label>
        <select
          id="tag"
          name="tag"
          value={displayTag}
          onChange={e => setDraft({ tag: e.target.value as NoteCategory })}
          className={css.select}
        >
          {}
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={displayContent}
          onChange={e => setDraft({ content: e.target.value })}
          className={css.textarea}
          placeholder="Write your thoughts here..."
          rows={6}
          required
        />
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Note'}
        </button>

        <button type="button" onClick={handleCancel} className={css.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
