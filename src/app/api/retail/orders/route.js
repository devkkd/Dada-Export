import { NextResponse } from 'next/server';
import { placeOrder, getUserOrders, getAllOrders } from '@/controllers/retail/orderController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/retail/orders
// — admin: all orders;  user: their orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });

    if (session.user?.role === 'admin') {
      const orders = await getAllOrders();
      return NextResponse.json({ success: true, data: orders });
    }

    const orders = await getUserOrders(session.user.id);
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/orders  — place order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const body  = await request.json();
    const order = await placeOrder(session.user.id, body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
