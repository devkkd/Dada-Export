import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/retail/Coupon';
import Order from '@/models/retail/Order';
import RetailUser from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';

const RETAIL_NEXTAUTH_SECRET = process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET;

async function getUser(req) {
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

// POST /api/retail/coupons/apply
export async function POST(request) {
  try {
    const userId = await getUser(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Login required to apply coupon' }, { status: 401 });
    }

    const { code, cartSubtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return NextResponse.json({ success: false, error: `Minimum order subtotal of ₹${coupon.minOrderAmount} is required` }, { status: 400 });
    }

    // Check if the user has already used this coupon
    const alreadyUsed = coupon.usedBy && coupon.usedBy.includes(userId);
    if (alreadyUsed) {
      return NextResponse.json({ success: false, error: 'You have already used this coupon code' }, { status: 400 });
    }

    // Check usageCriteria
    if (coupon.usageCriteria === 'first_order_only' || coupon.usageCriteria === 'new_users_only') {
      const orderCount = await Order.countDocuments({ userId, orderStatus: { $ne: 'cancelled' } });
      if (orderCount > 0) {
        return NextResponse.json({ success: false, error: 'This coupon code is only valid for your first order' }, { status: 400 });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    // Discount cannot exceed subtotal
    if (discount > cartSubtotal) {
      discount = cartSubtotal;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
