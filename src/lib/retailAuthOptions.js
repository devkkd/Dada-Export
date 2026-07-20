import GoogleProvider          from 'next-auth/providers/google';
import EmailProvider           from 'next-auth/providers/email';
import { connectDB }           from '@/lib/db';
import RetailUser              from '@/models/retail/User';
import nodemailer              from 'nodemailer';
import { RetailMongoAdapter }  from '@/lib/retailMongoAdapter';

// Retail auth base URL — NextAuth uses this to build callback URLs
const RETAIL_URL = process.env.RETAIL_NEXTAUTH_URL || 'http://localhost:3000/api/retail/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Custom magic-link email template
// ─────────────────────────────────────────────────────────────────────────────
async function sendVerificationRequest({ identifier: email, url, provider }) {
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const brandColor = '#281000';

  await transporter.sendMail({
    from:    `"ivara by Dada Exports" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: 'Sign in to ivara',
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F4F1;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

    <!-- Header -->
    <div style="background:${brandColor};padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:400;letter-spacing:2px;">ivara</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:12px;letter-spacing:1px;text-transform:uppercase;">by Dada Exports</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 40px 32px;">
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#1a1a1a;">Sign in to your account</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
        Click the button below to securely sign in. This link is valid for <strong>10 minutes</strong> and can only be used once.
      </p>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${url}" style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;padding:15px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
          Sign In →
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
        If you didn't request this email, you can safely ignore it. Your account remains secure.
      </p>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:#f0ebe5;margin:0 40px;"></div>

    <!-- Footer -->
    <div style="padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#bbb;">
        © ${new Date().getFullYear()} Dada Exports · ivara · This is an automated message
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `Sign in to ivara\n\nClick this link to sign in: ${url}\n\nThis link expires in 10 minutes and is single-use.\n\nIf you didn't request this, ignore this email.`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple in-memory store for magic-link verification tokens
// In production, use a DB adapter. Here we use NextAuth's built-in
// database-less JWT flow — the token IS the session.
// ─────────────────────────────────────────────────────────────────────────────

export const retailAuthOptions = {
  // ── Adapter (required for EmailProvider magic links) ──────────────────────
  adapter: RetailMongoAdapter(),

  providers: [
    // ── Google OAuth ────────────────────────────────────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Allow linking Google to an account created via email-OTP
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          // Always show account picker, even if already signed in
          prompt: 'select_account',
        },
      },
    }),

    // ── Magic Link (passwordless email) ─────────────────────────────────────
    EmailProvider({
      // We provide our own send function for branded email
      sendVerificationRequest,
      // Token valid for 10 minutes
      maxAge: 10 * 60,
    }),
  ],

  // ── Session strategy ──────────────────────────────────────────────────────
  // Keep JWT even with adapter — explicitly override NextAuth's default
  // (NextAuth switches to DB sessions when adapter is present, we don't want that)
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  // ── JWT ───────────────────────────────────────────────────────────────────
  // Use a dedicated secret so retail tokens can't be confused with admin tokens
  secret: process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // ── Callbacks ─────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * signIn: called after OAuth/Email verification succeeds.
     * We upsert the user into our DB here.
     */
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        const email    = user.email?.toLowerCase();
        const provider = account?.provider;

        if (!email) return false;

        // Try upsert — if duplicate key on phone (shouldn't happen after index fix),
        // fall back to findOne to still allow login
        try {
          await RetailUser.findOneAndUpdate(
            { email },
            {
              $set:      { name: user.name || '', image: user.image || '' },
              $addToSet: { providers: provider },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        } catch (upsertErr) {
          // If upsert fails (e.g. index issue), check if user already exists
          const existing = await RetailUser.findOne({ email });
          if (!existing) throw upsertErr; // genuinely failed
          // User exists — still allow login, just update what we can
          await RetailUser.updateOne({ email }, {
            $set:      { name: user.name || existing.name || '', image: user.image || existing.image || '' },
            $addToSet: { providers: provider },
          });
        }

        return true;
      } catch (err) {
        console.error('[retail signIn] ERROR:', err.message);
        return false;
      }
    },

    /**
     * jwt: persist user data in the token.
     * On first sign-in, `user` is provided — we load DB id.
     */
    async jwt({ token, user, account, trigger }) {
      if (user || trigger === 'update') {
        try {
          await connectDB();
          const email   = token.email?.toLowerCase();
          console.log('[retail jwt] Looking up user:', email);
          const dbUser  = await RetailUser.findOne({ email }).select('_id name image phone').lean();
          console.log('[retail jwt] DB user found:', !!dbUser, dbUser?._id);
          if (dbUser) {
            token.uid      = dbUser._id.toString();
            token.name     = dbUser.name  || token.name;
            token.image    = dbUser.image || token.picture;
            token.phone    = dbUser.phone || '';
            token.role     = 'retail_user';
            token.provider = account?.provider || token.provider;
          }
        } catch (err) {
          console.error('[retail jwt] ERROR:', err.message);
        }
      }
      return token;
    },

    /**
     * session: expose safe fields to the client via useSession().
     */
    async session({ session, token }) {
      session.user.id       = token.uid;
      session.user.phone    = token.phone    || '';
      session.user.role     = token.role     || 'retail_user';
      session.user.provider = token.provider || '';
      session.user.image    = token.image    || token.picture || '';
      return session;
    },
  },

  // ── Custom pages ──────────────────────────────────────────────────────────
  pages: {
    signIn:        '/retail/login',
    verifyRequest: '/retail/verify-email',
    error:         '/retail/login',
    newUser:       '/retail/account',   // first-time Google users → account page directly
  },

  // ── Cookies ───────────────────────────────────────────────────────────────
  // Custom names AND paths to avoid collision with admin NextAuth cookies
  cookies: {
    sessionToken: {
      name:    'retail-next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
    callbackUrl: {
      name:    'retail-next-auth.callback-url',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
    csrfToken: {
      name:    'retail-next-auth.csrf-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
    pkceCodeVerifier: {
      name:    'retail-next-auth.pkce.code_verifier',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 900 },
    },
    state: {
      name:    'retail-next-auth.state',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 900 },
    },
    nonce: {
      name:    'retail-next-auth.nonce',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
  },

  // ── Security ─────────────────────────────────────────────────────────────
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
};
