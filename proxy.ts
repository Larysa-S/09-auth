import { NextResponse, type NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

// Назва функції proxy строго за конвенцією Next.js 16!
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Оптимальна перевірка куки сесії без зайвих HTTP-запитів на бекенд.
  // Перевіряємо наявність куки 'session' або 'token' прямо з браузера.
  const isAuthenticated = request.cookies.has('session') || request.cookies.has('token');

  // Якщо маршрут приватний і користувач НЕ авторизований — редірект на вхід
  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Якщо користувач ВЖЕ авторизований, але намагається відкрити сторінку логіну/реєстрації — редірект на профіль
  if (isPublicRoute && isAuthenticated) {
    const profileUrl = new URL('/profile', request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Конфігурація matcher визначає маршрути, де запускається проксі
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
