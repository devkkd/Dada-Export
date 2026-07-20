import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export async function GET(request, context) {
  const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  process.env.NEXTAUTH_URL = origin.includes('/api/auth') ? origin : `${origin.replace(/\/$/, '')}/api/auth`;
  return handler(request, context);
}

export async function POST(request, context) {
  const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  process.env.NEXTAUTH_URL = origin.includes('/api/auth') ? origin : `${origin.replace(/\/$/, '')}/api/auth`;
  return handler(request, context);
}
