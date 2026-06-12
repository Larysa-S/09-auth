'use client';

import React from 'react';
import type { NoteCategory } from '@/types/note';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  note: {
    title: string;
    content: string;
    tag: NoteCategory;
  };
}

export default function NotePreview({ note }: NotePreviewProps) {
  return (
    <div className={css.content}>
      <span className={css.tag}>{note.tag}</span>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.description}>{note.content}</p>
    </div>
  );
}
