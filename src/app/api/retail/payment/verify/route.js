import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';
import RetailUser from '@/models/retail/User';
import Order from '@/models/retail/Order';
import { clearCart } from '@/controllers/retail/cartController';
import crypto from 'crypto';

const RETAIL_NEXTAUTH_SECRET = process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET;

async function getUserId(req) {
  const cookieStore = await cookies();
  const customToken = cookieStore.get(COOKIE_NAME)?.value;
  if (customToken) {
    const payload = await verifyRetailToken(customToken);
    if (payload?.sub) return payload.sub;
  }

  const nextAuthToken = await getToken({
    req,
    secret: RETAIL_NEXTAUTH_SECRET,
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

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    }

    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json();

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Missing required payment details' }, { status: 400 });
    }

    // Cryptographic signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ success: false, error: 'Razorpay secret is not configured on the server' }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      // Signature is invalid!
      await connectDB();
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      return NextResponse.json({ success: false, error: 'Invalid signature. Payment verification failed.' }, { status: 400 });
    }

    // Signature matches! Update order status to paid
    await connectDB();
    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      {
        paymentStatus: 'paid',
        paymentId: razorpayPaymentId,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Clear user's cart now that order has been paid
    await clearCart(userId);

    // If order has coupon code, add user to coupon's usedBy array
    if (order.couponCode) {
      try {
        const Coupon = (await import('@/models/retail/Coupon')).default;
        await Coupon.findOneAndUpdate(
          { code: order.couponCode.toUpperCase().trim() },
          { $addToSet: { usedBy: userId } }
        );
      } catch (err) {
        console.error('Error marking coupon as used:', err);
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
