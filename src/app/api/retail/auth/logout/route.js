import { NextResponse }           from 'next/server';
import { clearTokenCookie, COOKIE_NAME } from '@/lib/retailAuth';

const isSecure = process.env.NODE_ENV === 'production';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  // Clear the custom retail JWT cookie using response.cookies.set so multiple
  // Set-Cookie headers are handled correctly by NextResponse.
  response.cookies.set(COOKIE_NAME, '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });

  // Also clear NextAuth cookies used by retail auth
  response.cookies.set('retail-next-auth.session-token', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });
  response.cookies.set('retail-next-auth.callback-url', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });
  response.cookies.set('retail-next-auth.csrf-token', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });
  response.cookies.set('retail-next-auth.pkce.code_verifier', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });
  response.cookies.set('retail-next-auth.state', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });
  response.cookies.set('retail-next-auth.nonce', '', {
    path: '/', httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 0,
  });

  return response;
}
