import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllB2BProducts, createB2BProduct } from '@/controllers/b2b/productController';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// GET /api/admin/b2b/products
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const products = await getAllB2BProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/b2b/products
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!body.description) {
      return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 });
    }

    // empty strings → null for ObjectId refs
    if (!body.category)    body.category    = undefined;
    if (!body.subcategory) body.subcategory = null;

    const product = await createB2BProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
