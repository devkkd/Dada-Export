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
        const adminEmail    = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email    === adminEmail &&
          credentials?.password === adminPassword
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
    signIn: '/admin/login',   // redirect here on unauthenticated
    error:  '/admin/login',   // redirect here on error
  },

  secret: process.env.NEXTAUTH_SECRET,
};
