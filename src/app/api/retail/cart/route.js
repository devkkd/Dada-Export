import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { getCart, addToCart, removeFromCart, updateCartItem } from '@/controllers/retail/cartController';
import RetailUser from '@/models/retail/User';
import { verifyRetailToken, COOKIE_NAME } from '@/lib/retailAuth';

const RETAIL_NEXTAUTH_SECRET = process.env.RETAIL_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET;

async function getUser(req) {
  const cookieStore = await cookies();
  const customToken = cookieStore.get(COOKIE_NAME)?.value;
  if (customToken) {
    const payload = await verifyRetailToken(customToken);
    if (payload?.sub) return payload.sub;
  }

  const nextAuthToken = await getToken({
    req,
    secret: RETAIL_NEXTAUTH_SECRET,
    cookieName: 'retail-next-auth.session-token',
  });

  if (nextAuthToken?.uid) return nextAuthToken.uid;
  if (nextAuthToken?.email) {
    const user = await RetailUser.findOne({ email: nextAuthToken.email.toLowerCase() }).select('_id').lean();
    return user?._id?.toString() || null;
  }

  return null;
}

// GET /api/retail/cart
export async function GET(request) {
  try {
    const userId = await getUser(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const cart = await getCart(userId);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/cart  — add item or merge guest cart
export async function POST(request) {
  try {
    const userId = await getUser(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const body = await request.json();

    if (Array.isArray(body.items)) {
      const items = body.items
        .filter((item) => item && (item.productId || item.id) && item.quantity > 0)
        .map((item) => ({
          productId: item.productId || item.id,
          size:       item.size,
          color:      item.color,
          quantity:   item.quantity || 1,
        }));

      let cart;
      for (const item of items) {
        cart = await addToCart(userId, item);
      }
      return NextResponse.json({ success: true, data: cart || (await getCart(userId)) });
    }

    const cart = await addToCart(userId, body);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// PATCH /api/retail/cart  — update qty
export async function PATCH(request) {
  try {
    const userId = await getUser(request);
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
    const userId = await getUser(request);
    if (!userId) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 });
    const { itemId } = await request.json();
    const cart = await removeFromCart(userId, itemId);
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
