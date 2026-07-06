import { NextResponse } from 'next/server';
import { getCart, addToCart, removeFromCart, updateCartItem } from '@/controllers/retail/cartController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

// GET /api/retail/cart
export async function GET() {
  try {
    const userId = await getUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const cart = await getCart(userId);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/cart  — add item
export async function POST(request) {
  try {
    const userId = await getUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const body = await request.json();
    const cart = await addToCart(userId, body);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// PATCH /api/retail/cart  — update qty
export async function PATCH(request) {
  try {
    const userId = await getUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const { itemId, quantity } = await request.json();
    const cart = await updateCartItem(userId, itemId, quantity);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// DELETE /api/retail/cart  — remove item
export async function DELETE(request) {
  try {
    const userId = await getUser();
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const { itemId } = await request.json();
    const cart = await removeFromCart(userId, itemId);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
