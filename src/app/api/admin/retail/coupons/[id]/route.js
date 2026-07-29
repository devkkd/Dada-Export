import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Coupon from '@/models/retail/Coupon';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// PATCH /api/admin/retail/coupons/[id]
export async function PATCH(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 444 });
    }

    if (body.code) coupon.code = body.code.toUpperCase().trim();
    if (body.discountType) coupon.discountType = body.discountType;
    if (body.discountValue !== undefined) coupon.discountValue = Number(body.discountValue);
    if (body.minOrderAmount !== undefined) coupon.minOrderAmount = Number(body.minOrderAmount);
    if (body.usageCriteria) coupon.usageCriteria = body.usageCriteria;
    if (body.isActive !== undefined) coupon.isActive = body.isActive;
    if (body.expiryDate !== undefined) coupon.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;

    await coupon.save();
    return NextResponse.json({ success: true, data: coupon });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/retail/coupons/[id]
export async function DELETE(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 444 });
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
