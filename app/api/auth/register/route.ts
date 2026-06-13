import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Надсилаємо запит реєстрації на реальний бекенд GoIT Study
    const apiRes = await api.post('/auth/register', body);

    const cookieStore = await cookies();
    const data = apiRes.data;

    // 2. 🚀 ВИПРАВЛЕНО: Дістаємо токени безпосередньо з JSON-відповіді GoIT API
    // Сервер GoIT повертає об'єкт, де токен лежить у data.token або data.user?.token
    const token = data.token || data.accessToken || data.user?.token;
    const refreshToken = data.refreshToken || data.user?.refreshToken;

    const res = NextResponse.json(data, { status: apiRes.status });

    // 3. 🚀 ВИПРАВЛЕНО: Самим записуємо токени у куки для системи Next.js
    if (token) {
      cookieStore.set('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 днів
      });
    }

    if (refreshToken) {
      cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 400 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
