import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Робимо запит на оригінальний бекенд GoIT
    const response = await axios.post('https://goit.study', body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const setCookieHeader = response.headers['set-cookie'];
    const nextResponse = NextResponse.json(response.data);

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

        // 🚀 ВИПРАВЛЕНО: Використовуємо подвійне приведення типів (as unknown as string)
        // Це повністю закриває проблему з overlap-помилкою компілятора TypeScript!
        const finalName = cookieName as unknown as string;
        const finalValue = cookieValue as unknown as string;

        nextResponse.cookies.set(finalName, finalValue, options);
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Registration failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
