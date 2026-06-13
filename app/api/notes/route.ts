import { NextResponse } from 'next/server';
import axios from 'axios';
// 🚀 ОРИГІНАЛЬНИЙ ІМПОРТ GOIT: Використовуємо внутрішній інстанс api замість чистого axios
import { api } from '../api';

// 🚀 1. GET /api/notes — Отримання списку нотаток з урахуванням query-параметрів
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Збираємо параметри фільтрації, які прийшли з фронтенду
    const params = {
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || undefined,
      perPage: searchParams.get('perPage') || undefined,
      tag: searchParams.get('tag') || undefined,
    };

    // ОРИГІНАЛЬНИЙ ЗАПИТ GOIT: Передаємо куки сесії далі на бекенд за допомогою headers запиту
    const response = await api.get('/notes', {
      params,
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to fetch notes' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// 🚀 2. POST /api/notes — Створення нової нотатки
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ОРИГІНАЛЬНИЙ ЗАПИТ GOIT: Створюємо нотатку через інстанс api з прокиданням кук
    const response = await api.post('/notes', body, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to create note' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
