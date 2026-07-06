import { NextResponse } from 'next/server';
import { getB2BProducts, createB2BProduct } from '@/controllers/b2b/productController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/b2b/products?category=Dresses&featured=true&newArrival=true
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category   = searchParams.get('category');
    const featured   = searchParams.get('featured')   === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const products   = await getB2BProducts({ category, featured, newArrival });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/b2b/products  — admin only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body    = await request.json();
    const product = await createB2BProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
