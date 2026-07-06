import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/controllers/categoryController';
import { deleteFromR2, getKeyFromUrl } from '@/lib/cloudflare';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// GET /api/admin/categories/[id]
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id]
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.parentId === '') body.parentId = null;

    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // delete image from R2 if it exists
    if (category.image) {
      const key = getKeyFromUrl(category.image);
      if (key) await deleteFromR2(key).catch(() => {}); // don't fail if R2 delete errors
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
