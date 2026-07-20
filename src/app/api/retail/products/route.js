import { NextResponse } from 'next/server';
import { getRetailProducts } from '@/controllers/retail/productController';

// GET /api/retail/products?category=ID&newArrival=true&featured=true
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category   = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const featured   = searchParams.get('featured') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const products   = await getRetailProducts({ category, subcategory, featured, newArrival });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
