import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail    = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();
        const email         = credentials?.email?.trim().toLowerCase();
        const password      = credentials?.password?.trim();

        if (
          email === adminEmail &&
          password === adminPassword
        ) {
          return {
            id:    '1',
            email: adminEmail,
            name:  'Admin',
            role:  'admin',
          };
        }

        return null; // login failed
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60, // 8 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id   = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id   = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },

  // Must be explicitly set — NextAuth uses this to build callback URLs in production
  url: process.env.NEXTAUTH_URL,

  secret: process.env.NEXTAUTH_SECRET,

  // Secure cookie settings for production (HTTPS)
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path:     '/',
        secure:   process.env.NODE_ENV === 'production',
      },
    },
  },
};
