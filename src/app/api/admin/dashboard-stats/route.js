import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import B2BProduct from '@/models/b2b/B2BProduct';
import Inquiry from '@/models/b2b/Inquiry';
import RetailProduct from '@/models/retail/RetailProduct';
import Order from '@/models/retail/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [
      b2bProductsCount,
      newInquiriesCount,
      retailProductsCount,
      retailOrdersCount
    ] = await Promise.all([
      B2BProduct.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      RetailProduct.countDocuments(),
      Order.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        b2bProducts: b2bProductsCount,
        newInquiries: newInquiriesCount,
        retailProducts: retailProductsCount,
        retailOrders: retailOrdersCount,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
