import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2 } from '@/lib/cloudflare';

const MAX_SIZE      = 10 * 1024 * 1024; // 10 MB per image
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * POST /api/admin/bulk-upload/images
 * Body: multipart/form-data
 *   - files: File[] (multiple images)
 *   - site: 'b2b' | 'retail'
 *
 * Images are stored at: bulk-images/{site}/{originalFilename}
 * Key = original filename (with SKU embedded), e.g. SKU001-1.jpg
 * Returns: { success, uploaded: [{filename, url, key}], errors: [{filename, error}] }
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const site     = formData.get('site') || 'b2b';
    const files    = formData.getAll('files');

    if (!files.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const uploaded = [];
    const errors   = [];

    for (const file of files) {
      if (typeof file === 'string') continue;

      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push({ filename: file.name, error: 'Invalid file type' });
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (buffer.length > MAX_SIZE) {
          errors.push({ filename: file.name, error: 'File too large (max 10 MB)' });
          continue;
        }

        // Store with original filename so SKU matching works
        const key = `bulk-images/${site}/${file.name}`;
        const url = await uploadToR2(buffer, key, file.type);

        uploaded.push({ filename: file.name, url, key });
      } catch (err) {
        errors.push({ filename: file.name, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      errors,
      total:  files.length,
      done:   uploaded.length,
      failed: errors.length,
    });
  } catch (err) {
    console.error('[bulk-upload/images]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
