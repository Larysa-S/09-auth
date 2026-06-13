import 'server-only'; // Гарантує, що цей код ніколи не потрапить у клієнтський бандл
import axios from 'axios';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 🔒 Збір токена для серверних запитів (SSR) та Middleware (proxy.ts)
const getAuthHeaders = async (explicitCookies?: string) => {
  let token = '';

  if (explicitCookies) {
    // 🚀 ВИПРАВЛЕНО: Якщо куки передані з proxy.ts, витягуємо accessToken через RegExp
    const match = explicitCookies.match(/accessToken=([^;]+)/);
    if (match) token = match[1];
  } else {
    // 🚀 ВИПРАВЛЕНО: Якщо це звичайний серверний компонент, беремо accessToken через next/headers
    const cookieStore = await cookies();
    token = cookieStore.get('accessToken')?.value || '';
  }

  return {
    headers: {
      // 🚀 ВИПРАВЛЕНО: Формуємо єдино правильний для GoIT Bearer заголовок замість кук
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// 🚀 1. Отримання всіх нотаток на сервері (Використовується для SSR префетчингу)
export const fetchNotes = async (
  params?: Record<string, string | number>
): Promise<FetchNotesResponse> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
      ...headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('SSR fetchNotes error:', error);
    return { notes: [], totalPages: 1 };
  }
};

// 🚀 2. Отримання однієї нотатки за ID на сервері
export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get<Note>(`${baseURL}/notes/${id}`, headers);
    return response.data;
  } catch (error) {
    console.error(`SSR fetchNoteById (${id}) error:`, error);
    return null;
  }
};

// 🚀 3. Отримання даних профайлу поточного користувача
export const getMe = async (): Promise<User | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get<User>(`${baseURL}/users/me`, headers);
    return response.data;
  } catch {
    return null;
  }
};

// 🚀 4. Перевірка сесії для proxy.ts
export const checkSession = async (explicitCookies?: string): Promise<User | null> => {
  try {
    const headers = await getAuthHeaders(explicitCookies);
    // 🚀 ВИПРАВЛЕНО: Стукаємо на валідний ендпоінт /users/me замість неіснуючого /auth/current
    const response = await axios.get<User | null>(`${baseURL}/users/me`, headers);
    return response.data;
  } catch {
    return null;
  }
};
