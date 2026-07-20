'use client';

// Thin wrapper so next-auth/react's signIn() knows to use /api/retail/auth
// We only need this for Google OAuth — our custom JWT auth doesn't use NextAuth client-side
import { SessionProvider } from 'next-auth/react';

export default function RetailSessionWrapper({ children }) {
  return (
    <SessionProvider basePath="/api/retail/auth" refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
