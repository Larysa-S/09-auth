import 'server-only'; // Гарантує, що цей код ніколи не потрапить у клієнтський бандл
import { cookies } from 'next/headers';
// 🚀 ВИПРАВЛЕНО: Імпортуємо AxiosResponse безпосередньо з типу або через інстанс,
// щоб у файлі взагалі не було імпорту чистого клієнта 'axios'
import type { AxiosResponse } from 'axios';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 🔒 Допоміжна функція для передачі кук з сервера на бекенд (для SSR компонентів)
const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
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

// 🚀 4. Перевірка та оновлення сесії
// 🔮 ВИПРАВЛЕНО: Повний та остаточний перехід на наш єдиний інстанс api
export const checkSession = async (
  explicitCookies?: string
): Promise<AxiosResponse<User | null>> => {
  if (explicitCookies) {
    // 🚀 ПРАВИЛЬНО: Використовуємо виключно наш екземпляр api, ніякого прямого axios!
    return await api.get<User | null>('/auth/session', {
      headers: {
        Cookie: explicitCookies,
      },
    });
  }

  // Звичайний виклик у додатку: повертаємо ПОВНИЙ об'єкт відповіді інстансу api (без .data)
  const config = await getServerHeaders();
  return await api.get<User | null>('/auth/session', config);
};
