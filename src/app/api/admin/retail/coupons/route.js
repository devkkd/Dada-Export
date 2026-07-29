import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/retail/Coupon';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// GET /api/admin/retail/coupons
export async function GET(request) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: coupons });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/admin/retail/coupons
export async function POST(request) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();
    
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ success: false, error: 'Code and Discount Value are required' }, { status: 400 });
    }

    const exists = await Coupon.findOne({ code: body.code.toUpperCase().trim() });
    if (exists) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: body.code.toUpperCase().trim(),
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderAmount: Number(body.minOrderAmount || 0),
      usageCriteria: body.usageCriteria || 'all',
      isActive: body.isActive !== undefined ? body.isActive : true,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
    });

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
