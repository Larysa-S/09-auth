import api from './api';
import { User } from '@/types/user';
import { Note, NoteCategory } from '@/types/note'; // Переконалися, що у вас types/note

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
  const response = await api.get<User | null>('/users/me');
  return response.data;
};

export const fetchNotes = async (
  params?: Record<string, string | number>
): Promise<FetchNotesResponse> => {
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

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', userData);
  return response.data;
};
