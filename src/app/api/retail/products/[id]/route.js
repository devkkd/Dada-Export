import { NextResponse } from 'next/server';
import { updateRetailProduct, deleteRetailProduct } from '@/controllers/retail/productController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function adminGuard() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

// PUT /api/retail/products/:id
export async function PUT(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body    = await request.json();
    const product = await updateRetailProduct(params.id, body);
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// DELETE /api/retail/products/:id
export async function DELETE(request, { params }) {
  try {
    if (!await adminGuard()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await deleteRetailProduct(params.id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
