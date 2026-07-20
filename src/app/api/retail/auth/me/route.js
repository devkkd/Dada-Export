import { NextResponse }                        from 'next/server';
import { cookies }                             from 'next/headers';
import { getToken }                            from 'next-auth/jwt';
import { connectDB }                           from '@/lib/db';
import RetailUser                              from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME }      from '@/lib/retailAuth';
import { signRetailToken, getTokenCookie }     from '@/lib/retailAuth';

export async function GET(req) {
  try {
    const cookieStore = await cookies();

    // ── 1. Try custom JWT cookie (email-OTP / phone-OTP flow) ──────────────
    const customToken = cookieStore.get(COOKIE_NAME)?.value;
    if (customToken) {
      const payload = await verifyRetailToken(customToken);
      if (!payload && process.env.NODE_ENV === 'development') console.debug('[me] custom token present but failed verify');
      if (payload?.sub) {
        await connectDB();
        const user = await RetailUser.findById(payload.sub).select('-__v').lean();
        if (user) {
          return NextResponse.json({
            success: true,
            user: {
              id:        user._id.toString(),
              name:      user.name  || '',
              phone:     user.phone || '',
              email:     user.email || '',
              image:     user.image || '',
              addresses: user.addresses || [],
            },
          });
        }
      }
    }

    // ── 2. Fallback: NextAuth JWT cookie (Google OAuth flow) ────────────────
    const nextAuthToken = await getToken({
      req,
      secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
      cookieName: 'retail-next-auth.session-token',
      // Must match the NEXTAUTH_URL used when the token was signed
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (nextAuthToken?.uid || nextAuthToken?.email) {
      await connectDB();

      // Find user by uid (in token) or by email
      const user = nextAuthToken.uid
        ? await RetailUser.findById(nextAuthToken.uid).select('-__v').lean()
        : await RetailUser.findOne({ email: nextAuthToken.email?.toLowerCase() }).select('-__v').lean();

      if (user) {
        // Issue a custom JWT cookie so future requests use path 1 (faster)
        const token = await signRetailToken({
          sub:   user._id.toString(),
          email: user.email,
          name:  user.name || '',
          role:  'retail_user',
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id:        user._id.toString(),
            name:      user.name  || '',
            phone:     user.phone || '',
            email:     user.email || '',
            image:     user.image || '',
            addresses: user.addresses || [],
          },
        });
        // Set the custom cookie so next request hits path 1 directly
        response.headers.set('Set-Cookie', getTokenCookie(token));
        return response;
      }
    }

    return NextResponse.json({ success: false, user: null }, { status: 401 });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
