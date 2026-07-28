import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { verifyRetailToken } from '@/lib/retailAuth';

const RETAIL_NEXTAUTH_SECRET = process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET;
const ADMIN_NEXTAUTH_SECRET  = process.env.NEXTAUTH_SECRET;

export async function proxy(req) {
  const retailToken = req.cookies.get('retail_token')?.value;
  const hasValidRetailToken = retailToken ? await verifyRetailToken(retailToken) : false;

  const adminToken = await getToken({
    req,
    secret: ADMIN_NEXTAUTH_SECRET,
    cookieName: 'admin-next-auth.session-token',
  });

  const retailNextAuthToken = await getToken({
    req,
    secret: RETAIL_NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });

  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────
  if (pathname === '/admin/login') {
    if (adminToken?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!adminToken || adminToken.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // ── Retail protected routes ────────────────────────────────
  if (pathname.startsWith('/retail/account')) {
    if (!retailNextAuthToken && !hasValidRetailToken) {
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
    '/retail/account/:path*',
  ],
};
