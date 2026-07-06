import { NextResponse } from 'next/server';
import { getRetailProducts, createRetailProduct } from '@/controllers/retail/productController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/retail/products?category=Dresses&featured=true
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured  = searchParams.get('featured') === 'true';
    const products  = await getRetailProducts({ category, featured });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/retail/products  — admin only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body    = await request.json();
    const product = await createRetailProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
