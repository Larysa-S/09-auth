import 'server-only'; // Гарантує, що цей код ніколи не потрапить у клієнтський бандл
import { cookies } from 'next/headers';
import { api } from './api'; // 🚀 ВИПРАВЛЕНО: Використовуємо спільний екземпляр з api.ts за вимогою ТЗ
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 🔒 Допоміжна функція для передачі кук з сервера на бекенд
const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      // 🚀 ВИПРАВЛЕНО: Передаємо ВСІ куки як один рядок, як вимагає ТЗ, замість Bearer токена
      Cookie: cookieStore.toString(),
    },
  };
};

// 🚀 1. Отримання всіх нотаток на сервері (SSR)
export const fetchNotes = async (
  params?: Record<string, string | number>
): Promise<FetchNotesResponse> => {
  try {
    const config = await getServerHeaders();
    // Використовуємо відносний шлях, бо в api.ts вже налаштовано baseURL
    const response = await api.get<FetchNotesResponse>('/notes', {
      ...config,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('SSR fetchNotes error:', error);
    return { notes: [], totalPages: 1 };
  }
};

// 🚀 2. Отримання однієї нотатки за ID на сервері (SSR)
export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const config = await getServerHeaders();
    const response = await api.get<Note>(`/notes/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`SSR fetchNoteById (${id}) error:`, error);
    return null;
  }
};

// 🚀 3. Отримання даних профайлу поточного користувача (SSR)
export const getMe = async (): Promise<User | null> => {
  try {
    const config = await getServerHeaders();
    const response = await api.get<User>('/users/me', config);
    return response.data;
  } catch (error) {
    console.error('SSR getMe error:', error);
    return null;
  }
};

// 🚀 4. Перевірка сесії (Обов'язкова функція за ТЗ)
export const checkSession = async (): Promise<User | null> => {
  try {
    const config = await getServerHeaders();
    // 🚀 ВИПРАВЛЕНО: Використовуємо правильний ендпоінт /auth/session згідно з ТЗ
    const response = await api.get<User>('/auth/session', config);
    return response.data;
  } catch (error) {
    console.error('SSR checkSession error:', error);
    return null;
  }
};
