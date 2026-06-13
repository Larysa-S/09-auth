import { NextResponse } from 'next/server'; // 🚀 ВИПРАВЛЕНО: Додано обов'язковий імпорт NextResponse
import axios from 'axios';
import { parse } from 'cookie';

export async function POST() {
  try {
    // Робимо запит до оригінального бекенду GoIT Study для виходу з системи
    const response = await axios.post(
      'https://goit.study',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Перехоплюємо заголовки set-cookie, які прислав бекенд (там буде Max-Age=0)
    const setCookieHeader = response.headers['set-cookie'];
    const nextResponse = new NextResponse(null, { status: 200 });

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
          maxAge: 0, // Примусово зануляємо куку у браузері, як вимагає логаут
        };

        const finalName = cookieName as unknown as string;
        const finalValue = cookieValue as unknown as string;

        // Передаємо інструкцію видалення куки у браузер студента
        nextResponse.cookies.set(finalName, finalValue, options);
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    // Безпечна обробка помилок за допомогою NextResponse без any
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Logout failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred during logout.' },
      { status: 500 }
    );
  }
}
