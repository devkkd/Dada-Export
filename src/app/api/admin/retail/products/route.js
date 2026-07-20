import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllRetailProducts, createRetailProduct } from '@/controllers/retail/productController';

function unauth() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// GET /api/admin/retail/products
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauth();
  try {
    const products = await getAllRetailProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/admin/retail/products
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauth();
  try {
    const body    = await request.json();
    const product = await createRetailProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
