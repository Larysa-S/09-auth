import axios, { type AxiosResponse } from 'axios';
// Імпортуємо типи через аліас
import type { Note, NoteCategory } from '@/types/note';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string; // Додано для фільтрації в паралельних маршрутах
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteCategory;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const notehubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

// 1. Отримання списку нотаток (з пагінацією, пошуком та фільтрацією за тегом)
export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const queryParams: Record<string, unknown> = {
    page: params.page,
    perPage: params.perPage,
  };

  // Додаємо пошук, якщо він не порожній
  if (params.search && params.search.trim() !== '') {
    queryParams.search = params.search.trim();
  }

  // Якщо є тег і він не дорівнює 'all', додаємо його в запит до бекенду за ТЗ
  if (params.tag && params.tag !== 'all') {
    queryParams.tag = params.tag;
  }

  const response: AxiosResponse<FetchNotesResponse> = await notehubApi.get('/notes', {
    params: queryParams,
  });
  return response.data;
};

// 2. Створення нової нотатки
export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post('/notes', noteData);
  return response.data;
};

// 3. Видалення нотатки за її ID
export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.delete(`/notes/${noteId}`);
  return response.data;
};

// 4. Отримання деталей ОДНІЄЇ нотатки за її ID (експортовано з маленької літери в однині!)
export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.get(`/notes/${noteId}`);
  return response.data;
};
