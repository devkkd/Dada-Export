import { NextResponse }                from 'next/server';
import { cookies }                    from 'next/headers';
import { getToken }                   from 'next-auth/jwt';
import { connectDB }                  from '@/lib/db';
import Order                          from '@/models/retail/Order';
import RetailUser                     from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';

/**
 * GET /api/retail/orders/me
 * Returns orders for the currently logged-in retail user.
 * Supports both custom JWT cookie and NextAuth JWT cookie.
 */
export async function GET(req) {
  try {
    await connectDB();

    let userId = null;

    // ── 1. Custom JWT cookie ────────────────────────────────────────────────
    const cookieStore = await cookies();
    const customToken = cookieStore.get(COOKIE_NAME)?.value;
    if (customToken) {
      const payload = await verifyRetailToken(customToken);
      if (payload?.sub) userId = payload.sub;
    }

    // ── 2. NextAuth JWT (Google OAuth) ──────────────────────────────────────
    if (!userId) {
      const nextAuthToken = await getToken({
        req,
        secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
        cookieName: 'retail-next-auth.session-token',
      });
      if (nextAuthToken?.uid) {
        userId = nextAuthToken.uid;
      } else if (nextAuthToken?.email) {
        const u = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
        if (u) userId = u._id.toString();
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders:  orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        userId: o.userId.toString(),
      })),
    });
  } catch (err) {
    console.error('[orders/me]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
