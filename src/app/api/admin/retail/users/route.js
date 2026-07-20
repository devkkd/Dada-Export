import { NextResponse }  from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }   from '@/lib/auth';
import { connectDB }     from '@/lib/db';
import RetailUser        from '@/models/retail/User';
import Order             from '@/models/retail/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all users
    const users = await RetailUser.find({}).sort({ createdAt: -1 }).lean();

    // Get order counts in one aggregation
    const orderCounts = await Order.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    orderCounts.forEach((o) => { countMap[o._id.toString()] = o.count; });

    const result = users.map((u) => ({
      ...u,
      _id:        u._id.toString(),
      orderCount: countMap[u._id.toString()] || 0,
    }));

    return NextResponse.json({ success: true, users: result });
  } catch (err) {
    console.error('[admin users]', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
