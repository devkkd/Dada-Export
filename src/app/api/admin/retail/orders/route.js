import { NextResponse } from 'next/server';
import { getAllOrders } from '@/controllers/retail/orderController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// GET /api/admin/retail/orders
export async function GET(request) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orders = await getAllOrders({ status: status === 'all' ? undefined : status });
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
