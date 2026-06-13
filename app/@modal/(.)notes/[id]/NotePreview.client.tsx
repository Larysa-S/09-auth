'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';
import { fetchNoteById } from '@/lib/api/clientApi';
// ІМПОРТУЄМО СТИЛІ ЗА ЗАВДАННЯМ:
import css from './NotePreview.client.module.css';

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Клієнтський useQuery миттєво підтягне дані з HydrationBoundary
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false, // Обов'язково за ТЗ ментора
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {/* ВИПРАВЛЕНО: Окрема кнопка закриття з класом із вашого CSS-модуля */}
      {/* Якщо в файлі інша назва класу, наприклад css.close, змініть її тут */}
      <button
        type="button"
        onClick={handleClose}
        className={css.closeButton || css.close}
        aria-label="Close modal"
      >
        ×
      </button>

      {isLoading ? (
        <p>Loading note...</p>
      ) : note ? (
        <NotePreview note={note} />
      ) : (
        <p>Note not found.</p>
      )}
    </Modal>
  );
}
