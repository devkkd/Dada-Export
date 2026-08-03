import NextAuth from 'next-auth';
import { retailAuthOptions } from '@/lib/retailAuthOptions';

/**
 * Retail NextAuth handler — /api/retail/auth/[...nextauth]
 * basePath is set inside retailAuthOptions so Google callback URI is:
 *   https://dadaexports.com/api/retail/auth/callback/google
 */
const handler = NextAuth(retailAuthOptions);

export { handler as GET, handler as POST };
