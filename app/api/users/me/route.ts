import { NextResponse } from 'next/server'; // 🚀 ВИПРАВЛЕНО: Додано точний іменований імпорт NextResponse у фігурних дужках
import axios from 'axios';
import { api } from '../../api';

// 🚀 1. GET /api/users/me — Отримання профілю поточного користувача
export async function GET(request: Request) {
  try {
    // Еталонний запит GoIT з прокиданням cookies з браузера
    const response = await api.get('/users/me', {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to fetch user profile' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. PATCH /api/users/me — Оновлення даних профілю
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // Оновлюємо дані через інстанс api з прокиданням кук
    const response = await api.patch('/users/me', body, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to update user profile' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
