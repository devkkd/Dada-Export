import NextAuth from 'next-auth';
import { retailAuthOptions } from '@/lib/retailAuthOptions';

/**
 * Retail NextAuth handler — /api/retail/auth/[...nextauth]
 *
 * NextAuth v4 reads process.env.NEXTAUTH_URL at *request time* to build
 * OAuth redirect_uri values. It must point to this handler's base path
 * (/api/retail/auth) so Google receives the correct callback URL.
 *
 * The admin handler uses CredentialsProvider only — no OAuth, no callback
 * URLs — so overriding NEXTAUTH_URL here does not affect it.
 */
const handler = NextAuth(retailAuthOptions);

export async function GET(request, context) {
  const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  process.env.NEXTAUTH_URL = process.env.RETAIL_NEXTAUTH_URL || 
    (origin.includes('/api/auth') ? origin.replace('/api/auth', '/api/retail/auth') : `${origin.replace(/\/$/, '')}/api/retail/auth`);
  return handler(request, context);
}

export async function POST(request, context) {
  const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  process.env.NEXTAUTH_URL = process.env.RETAIL_NEXTAUTH_URL || 
    (origin.includes('/api/auth') ? origin.replace('/api/auth', '/api/retail/auth') : `${origin.replace(/\/$/, '')}/api/retail/auth`);
  return handler(request, context);
}
