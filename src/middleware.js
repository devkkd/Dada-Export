import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────
  // /admin/login is public — let it through
  if (pathname === '/admin/login') {
    // if already logged in as admin, redirect to dashboard
    if (token?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // all other /admin/* routes require admin session
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // ── Retail protected routes ────────────────────────────────
  // cart and account require a logged-in retail user
  if (pathname.startsWith('/retail/cart') || pathname.startsWith('/retail/account')) {
    if (!token) {
      const url = new URL('/retail', req.url);
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/retail/cart/:path*',
    '/retail/account/:path*',
  ],
};
