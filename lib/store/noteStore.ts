import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteCategory } from '@/types/note';

// 1. Початковий стан чернетки за технічним завданням
const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo' as NoteCategory, // Ментор просить використовувати 'Todo' за замовчуванням
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

// 2. Створюємо стор із використанням middleware persist
export const useNoteStore = create<NoteState>()(
  persist(
    set => ({
      draft: initialDraft,

      // Функція для оновлення полів чернетки (підтримує часткове оновлення)
      setDraft: updatedFields =>
        set(state => ({
          draft: { ...state.draft, ...updatedFields },
        })),

      // Функція для очищення чернетки до початкового стану
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft-storage', // Унікальний ключ для localStorage
    }
  )
);
