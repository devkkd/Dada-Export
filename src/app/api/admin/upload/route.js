import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2 } from '@/lib/cloudflare';

// Max file size: 5 MB
const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// POST /api/admin/upload
// Body: multipart/form-data  { file: File, folder: string }
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file     = formData.get('file');
    const folder   = formData.get('folder') || 'uploads'; // e.g. "categories"

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
        { status: 400 }
      );
    }

    // validate size
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size must be under 5 MB' },
        { status: 400 }
      );
    }

    // build a unique key: folder/timestamp-originalname
    const ext      = file.name.split('.').pop().toLowerCase();
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')             // strip extension
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const key = `${folder}/${Date.now()}-${safeName}.${ext}`;

    const url = await uploadToR2(buffer, key, file.type);

    return NextResponse.json({ success: true, url, key });
  } catch (error) {
    console.error('[upload] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
