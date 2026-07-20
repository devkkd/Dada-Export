import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/controllers/retail/orderController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// GET /api/admin/retail/orders/:id
export async function GET(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const order = await getOrderById(id);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/retail/orders/:id
export async function PATCH(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const order = await updateOrderStatus(id, body);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
