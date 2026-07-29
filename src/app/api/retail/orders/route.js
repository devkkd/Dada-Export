import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { placeOrder, getUserOrders, getAllOrders } from '@/controllers/retail/orderController';
import RetailUser from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';
import Razorpay from 'razorpay';

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

// GET /api/retail/orders
// — admin: all orders; user: their orders
export async function GET(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });

    // Admin routes should still use the session-based admin auth elsewhere.
    // For retail customers, return only their orders.
    const orders = await getUserOrders(userId);
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/orders  — place order
export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Razorpay keys are not configured on the server. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const order = await placeOrder(userId, body);

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.round(order.totalAmount * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
    });

    // Save Razorpay order ID to the database order document
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      razorpayOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
