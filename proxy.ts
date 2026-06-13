import { NextResponse, type NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

// 🚀 ВИПРАВЛЕНО: Назва функції proxy строго за конвенцією Next.js 16!
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  let isAuthenticated = false;

  try {
    const cookieString = request.headers.get('cookie') || '';
    const session = await checkSession(cookieString);
    isAuthenticated = !!session;
  } catch {
    isAuthenticated = false;
  }

  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && isAuthenticated) {
    const profileUrl = new URL('/profile', request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
