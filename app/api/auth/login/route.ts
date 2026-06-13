import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import axios from 'axios'; // 🚀 ДОДАНО: Імпортуємо axios для безпечної перевірки помилки
import { api } from '../../api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ОРИГІНАЛЬНИЙ ЗАПИТ GOIT: Запит через інстанс api
    const apiRes = await api.post('/auth/login', body);

    const setCookieHeader = apiRes.headers['set-cookie'];
    const nextResponse = NextResponse.json(apiRes.data, { status: apiRes.status });

    if (setCookieHeader) {
      setCookieHeader.forEach(cookieStr => {
        const parsedCookie = parse(cookieStr);

        const cookieEntries = Object.entries(parsedCookie);
        if (cookieEntries.length === 0) return;

        const [cookieName, cookieValue] = cookieEntries;

        const options = {
          path: parsedCookie.Path || '/',
          httpOnly: cookieStr.includes('HttpOnly'),
          secure: cookieStr.includes('Secure'),
          sameSite: (parsedCookie.SameSite?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax',
          maxAge: parsedCookie['Max-Age'] ? parseInt(parsedCookie['Max-Age'], 10) : undefined,
        };

        const finalName = cookieName as unknown as string;
        const finalValue = cookieValue as unknown as string;

        nextResponse.cookies.set(finalName, finalValue, options);
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    // 🚀 ВИПРАВЛЕНО: Замість any безпечно типізуємо помилку через axios.isAxiosError
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Login failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
