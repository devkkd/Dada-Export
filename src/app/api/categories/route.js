import { NextResponse } from 'next/server';
import { getCategoriesTree } from '@/controllers/categoryController';

// GET /api/categories?site=b2b  or  ?site=retail
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site'); // 'b2b' | 'retail' | null (all)

    const tree = await getCategoriesTree(site);
    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
