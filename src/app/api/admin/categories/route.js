import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAllCategories,
  createCategory,
} from '@/controllers/categoryController';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

// GET /api/admin/categories  — list all (admin only)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('[GET /api/admin/categories]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/categories  — create new category
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  try {
    const body = await request.json();

    // basic validation
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    if (!body.site) {
      return NextResponse.json(
        { success: false, error: 'Site is required' },
        { status: 400 }
      );
    }

    // if parentId is empty string, set to null
    if (body.parentId === '') body.parentId = null;

    const category = await createCategory(body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    // duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A category with this name/slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
