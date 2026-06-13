import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteCategory } from '@/types/note';

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo' as NoteCategory,
};

interface DraftFields {
  title: string;
  content: string;
  tag: NoteCategory;
}

interface NoteState {
  draft: DraftFields;
  setDraft: (note: Partial<DraftFields>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteState>()(
  // 🚀 ВИПРАВЛЕНО: Явно додаємо тип <NoteState> для persist, щоб TypeScript не втрачав типи
  persist<NoteState>(
    set => ({
      draft: initialDraft,

      // Функція для оновлення полів чернетки
      setDraft: updatedFields =>
        set(state => ({
          draft: { ...state.draft, ...updatedFields },
        })),

      // Функція для очищення чернетки
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft-storage', // Ключ для localStorage
    }
  )
);
