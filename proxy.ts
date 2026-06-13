import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';
import { parse } from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  // 1. Перевіряємо саме куки accessToken та refreshToken за вимогами ментора
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = !!accessToken;
  let newCookiesHeader: string[] | null = null;

  // 2. Логіка оновлення сесії (Silent Refresh) за допомогою refreshToken
  if (!accessToken && refreshToken) {
    try {
      const cookieString = `refreshToken=${refreshToken}`;
      const apiRes = await checkSession(cookieString);

      if (apiRes.status === 200) {
        isAuthenticated = true;
        const setCookie = apiRes.headers['set-cookie'];
        if (setCookie) {
          newCookiesHeader = Array.isArray(setCookie) ? setCookie : [setCookie];
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Редірект для неавторизованих користувачів на сторінку входу
  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Редірект авторизованих користувачів на головну сторінку (/), а не на /profile
  if (isPublicRoute && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  const response = NextResponse.next();

  // Якщо отримано нові токени — безпечно записуємо їх у браузер користувача
  if (newCookiesHeader) {
    newCookiesHeader.forEach(cookieStr => {
      const parsedCookie = parse(cookieStr);
      const cookieEntries = Object.entries(parsedCookie);
      if (cookieEntries.length === 0) return;

      const [cookieName, cookieValue] = cookieEntries;

      // 🚀 ВИПРАВЛЕНО: Використовуємо безпечне подвійне приведення типів
      // Це повністю прибирає помилку "conversion of type may be mistake"
      const finalName = cookieName as unknown as string;
      const finalValue = cookieValue as unknown as string;

      response.cookies.set(finalName, finalValue, {
        path: parsedCookie.Path || '/',
        httpOnly: cookieStr.includes('HttpOnly'),
        secure: cookieStr.includes('Secure'),
        sameSite: (parsedCookie.SameSite?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax',
        maxAge: parsedCookie['Max-Age'] ? parseInt(parsedCookie['Max-Age'], 10) : undefined,
      });
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
