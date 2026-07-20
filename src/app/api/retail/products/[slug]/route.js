import { NextResponse } from 'next/server';
import { getRetailProductBySlug } from '@/controllers/retail/productController';

// GET /api/retail/products/[slug]
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const product = await getRetailProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
