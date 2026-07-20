import { NextResponse }      from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/lib/auth';
import { connectDB }         from '@/lib/db';
import Order                 from '@/models/retail/Order';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      orders:  orders.map((o) => ({ ...o, _id: o._id.toString(), userId: o.userId.toString() })),
    });
  } catch (err) {
    console.error('[admin user orders]', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
