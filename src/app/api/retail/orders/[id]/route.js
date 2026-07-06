import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/controllers/retail/orderController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/retail/orders/:id
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const order = await getOrderById(params.id);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/retail/orders/:id  — admin update status
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body  = await request.json();
    const order = await updateOrderStatus(params.id, body);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
