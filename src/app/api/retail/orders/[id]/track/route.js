import { NextResponse }                    from 'next/server';
import { cookies }                        from 'next/headers';
import { getToken }                       from 'next-auth/jwt';
import { connectDB }                      from '@/lib/db';
import RetailUser                         from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';
import { getOrderById }                   from '@/controllers/retail/orderController';
import { trackShipment }                  from '@/lib/shiprocket';

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

// GET /api/retail/orders/:id/track
export async function GET(request, { params }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order  = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Only the order owner can track
    if (String(order.userId) !== String(userId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!order.trackingId) {
      return NextResponse.json({
        success:     true,
        tracked:     false,
        message:     'Tracking not available yet — shipment not dispatched',
        orderStatus: order.orderStatus,
      });
    }

    const tracking = await trackShipment(order.trackingId);

    return NextResponse.json({
      success:     true,
      tracked:     true,
      trackingId:  order.trackingId,
      orderStatus: order.orderStatus,
      ...tracking,
    });
  } catch (err) {
    console.error('[track order]', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
