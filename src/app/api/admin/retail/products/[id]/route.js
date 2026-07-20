import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateRetailProduct, deleteRetailProduct, getAllRetailProducts } from '@/controllers/retail/productController';
import RetailProduct from '@/models/retail/RetailProduct';
import { connectDB } from '@/lib/db';

function unauth() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// GET /api/admin/retail/products/[id]
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauth();
  try {
    const { id } = await params;
    await connectDB();
    const product = await RetailProduct.findById(id).lean();
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/retail/products/[id]
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauth();
  try {
    const { id }  = await params;
    const body    = await request.json();
    const updated = await updateRetailProduct(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// DELETE /api/admin/retail/products/[id]
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauth();
  try {
    const { id } = await params;
    await deleteRetailProduct(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
