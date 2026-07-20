import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listR2Objects } from '@/lib/cloudflare';

/**
 * GET /api/admin/r2-images?sku=SKU001&site=b2b
 * Lists all R2 images matching the SKU prefix.
 * Tries multiple folder patterns to find images anywhere on R2.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sku  = searchParams.get('sku')?.trim();
  const site = searchParams.get('site') || 'b2b';

  if (!sku) {
    return NextResponse.json({ success: false, error: 'SKU is required' }, { status: 400 });
  }

  try {
    const prefixes = [
      `bulk-images/${site}/${sku}`, // bulk-images/b2b/SKU001
      `bulk-images/${sku}`,          // bulk-images/SKU001
      `${site}/${sku}`,              // b2b/SKU001
      `${site}-products/${sku}`,     // b2b-products/SKU001
      sku,                           // SKU001 (root level)
    ];

    let found = [];
    for (const prefix of prefixes) {
      const objects = await listR2Objects(prefix);
      if (objects.length > 0) {
        // Sort: SKU-1 before SKU-2 before SKU-10
        objects.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
        found = objects.map((o) => o.url);
        break;
      }
    }

    return NextResponse.json({ success: true, images: found, sku });
  } catch (err) {
    console.error('[r2-images]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
