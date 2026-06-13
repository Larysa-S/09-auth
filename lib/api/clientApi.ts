import { api } from './api';
import { User } from '@/types/user';
import { Note, NoteCategory } from '@/types/note';

// 📝 Описуємо точні інтерфейси для аргументів запитів
interface FetchNotesParams {
  page?: number | string;
  perPage?: number | string;
  search?: string;
  tag?: NoteCategory | string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface RegisterData {
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteCategory;
}

// 🚀 Додатковий інтерфейс для суворого редагування профілю за порадою ментора
interface UpdateMePayload {
  username: string;
}

export const register = async (userData: RegisterData): Promise<User> => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post<void>('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await api.get<User | null>('/auth/session');
    return response.data;
  } catch {
    return null;
  }
};

// 🔮 ПОКРАЩЕНО: Тепер параметри мають чіткі назви та типи замість Record
export const fetchNotes = async (params?: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

// 🔥 ПОКРАЩЕНО (Рекомендація ментора): Обмежили тип лише полем username
export const updateMe = async (userData: UpdateMePayload): Promise<User> => {
  const response = await api.patch<User>('/users/me', userData);
  return response.data;
};
