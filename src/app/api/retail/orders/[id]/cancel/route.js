import { NextResponse }                    from 'next/server';
import { cookies }                        from 'next/headers';
import { getToken }                       from 'next-auth/jwt';
import { connectDB }                      from '@/lib/db';
import RetailUser                         from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';
import { cancelOrder }                    from '@/controllers/retail/orderController';

// Same auth helper used across all retail order routes
async function getUserId(req) {
  const cookieStore = await cookies();
  const customToken = cookieStore.get(COOKIE_NAME)?.value;
  if (customToken) {
    const payload = await verifyRetailToken(customToken);
    if (payload?.sub) return payload.sub;
  }

  const nextAuthToken = await getToken({
    req,
    secret:     process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });

  if (nextAuthToken?.uid) return nextAuthToken.uid;
  if (nextAuthToken?.email) {
    await connectDB();
    const user = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
    return user?._id?.toString() || null;
  }

  return null;
}

// POST /api/retail/orders/:id/cancel
// Body: { reason: string }
export async function POST(request, { params }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Please login to cancel order' }, { status: 401 });
    }

    const { id } = await params;
    const body   = await request.json().catch(() => ({}));
    const reason = body.reason?.trim() || 'Cancelled by customer';

    const order = await cancelOrder(id, userId, reason);

    return NextResponse.json({
      success:     true,
      message:     'Order cancelled successfully',
      orderStatus: order.orderStatus,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
