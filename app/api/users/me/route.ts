export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();

    // 🚀 ВИПРАВЛЕНО: Дістаємо токен із нашої куки, яку створили роути авторизації
    const token = cookieStore.get('accessToken')?.value || '';

    // Якщо токена немає в браузері — це точно анонімний гість.
    // Повертаємо null без зайвих запитів до GoIT, щоб розвантажити мережу
    if (!token) {
      return NextResponse.json(null, { status: 200 });
    }

    // 🚀 ВИПРАВЛЕНО: Передаємо токен у заголовку Authorization Bearer, як вимагає GoIT API
    const res = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      // 🚀 ВИПРАВЛЕНО: Якщо токен застарів або невалідний (401), повертаємо null зі статусом 200.
      // Це дасть сигнал провайдеру, що користувач — гість, і додаток не буде падати чи зациклюватися!
      if (error.response?.status === 401) {
        return NextResponse.json(null, { status: 200 });
      }

      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const body = await request.json();

    // 🚀 ВИПРАВЛЕНО: Передаємо токен у заголовку Authorization для оновлення профілю
    const res = await api.patch('/users/me', body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
