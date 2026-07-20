import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

const B2B_HEADERS = [
  'SKU', 'name', 'breadcrumbLabel', 'description',
  'price', 'moq', 'fabric', 'category', 'subcategory',
  'sizes', 'colors', 'highlights', 'keyFeatures', 'careInstructions',
  'tags', 'isFeatured', 'isNewArrival', 'isActive', 'imageUrl',
];

const B2B_EXAMPLE = {
  SKU:              'SKU001',
  name:             'Botanical Halter Maxi Dress',
  breadcrumbLabel:  'Tie-Up Drawstring Flowy A-Line Summer Dress',
  description:      'Elegant halter maxi dress with adjustable back strap...',
  price:            1899,
  moq:              50,
  fabric:           '100% Premium Rayon',
  category:         'Dresses',
  subcategory:      'Maxi Dress',
  sizes:            'XS,S,M,L,XL,2XL',
  colors:           'Olive Green:#4A7043,Black:#1F1F1F,Rose:#E11D48',
  highlights:       'Color:Olive Green|Fabric:Rayon|Occasion:Casual|Length:Maxi',
  keyFeatures:      'Premium quality 100% rayon fabric|Breathable and skin-friendly|Adjustable halter tie-up',
  careInstructions: 'Hand wash in cold water|Do not bleach|Shade dry',
  tags:             'summer,floral,maxi,halter',
  isFeatured:       'false',
  isNewArrival:     'true',
  isActive:         'true',
};

const RETAIL_HEADERS = [
  'SKU', 'name', 'breadcrumbLabel', 'description',
  'price', 'mrp', 'fabric', 'category', 'subcategory',
  'variants', 'prints', 'colors', 'highlights', 'keyFeatures', 'careInstructions',
  'tags', 'isFeatured', 'isNewArrival', 'isActive', 'imageUrl',
];

const RETAIL_EXAMPLE = {
  SKU:              'SKU001',
  name:             'Women Olive Floral Halter Neck Maxi Dress',
  breadcrumbLabel:  'Tie-Up Drawstring Flowy A-Line Summer Dress',
  description:      'Step into effortless elegance with this premium rayon dress...',
  price:            1899,
  mrp:              2499,
  fabric:           '100% Premium Rayon',
  category:         'Dresses',
  subcategory:      'Maxi Dress',
  variants:         'XS:5,S:20,M:30,L:25,XL:15,2XL:5',
  prints:           'Floral,Paisley,Block Print',
  colors:           'Olive Green:#4A7043,Black:#1F1F1F,Rose:#E11D48',
  highlights:       'Color:Olive Green|Fabric:Rayon|Occasion:Casual|Length:Maxi',
  keyFeatures:      'Premium quality 100% rayon fabric|Breathable and skin-friendly|Adjustable halter tie-up',
  careInstructions: 'Hand wash in cold water|Do not bleach|Shade dry',
  tags:             'summer,floral,maxi,halter',
  isFeatured:       'false',
  isNewArrival:     'true',
  isActive:         'true',
};

const INSTRUCTIONS = [
  ['FIELD', 'FORMAT', 'EXAMPLE'],
  ['SKU', 'Unique code. Image files must be named SKU-1.jpg, SKU-2.jpg etc.', 'SKU001'],
  ['name', 'Product name — slug is AUTO-GENERATED from this. No slug column needed.', 'Botanical Halter Maxi Dress'],
  ['slug', 'OPTIONAL. Leave blank — auto-generated from name. If duplicate, SKU suffix added.', '(leave blank)'],
  ['colors', 'Name:#hex comma-separated', 'Olive Green:#4A7043,Black:#1F1F1F'],
  ['highlights', 'Label:Value pipe-separated', 'Color:Olive|Fabric:Rayon|Occasion:Casual'],
  ['keyFeatures', 'Pipe-separated bullet points', 'Feature one|Feature two|Feature three'],
  ['careInstructions', 'Pipe-separated', 'Hand wash|Do not bleach|Shade dry'],
  ['sizes (B2B)', 'Comma-separated', 'XS,S,M,L,XL,2XL'],
  ['variants (Retail)', 'Size:Stock comma-separated', 'S:20,M:30,L:25,XL:15'],
  ['prints (Retail)', 'Comma-separated print types', 'Floral,Paisley,Block Print'],
  ['isFeatured / isNewArrival / isActive', 'true or false', 'true'],
];

// GET /api/admin/bulk-upload/template?site=b2b  OR  ?site=retail
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const site = searchParams.get('site') || 'b2b';
  const isB2B = site === 'b2b';

  const headers     = isB2B ? B2B_HEADERS     : RETAIL_HEADERS;
  const exampleRow  = isB2B ? B2B_EXAMPLE     : RETAIL_EXAMPLE;

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Products ──────────────────────────────
  const productData = [headers, headers.map((h) => exampleRow[h] ?? '')];
  const ws1 = XLSX.utils.aoa_to_sheet(productData);

  // Column widths
  ws1['!cols'] = headers.map((h) => ({
    wch: h === 'description' || h === 'highlights' || h === 'keyFeatures' ? 50 : 22,
  }));

  XLSX.utils.book_append_sheet(wb, ws1, 'Products');

  // ── Sheet 2: Instructions ──────────────────────────
  const ws2 = XLSX.utils.aoa_to_sheet(INSTRUCTIONS);
  ws2['!cols'] = [{ wch: 25 }, { wch: 55 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Instructions');

  // ── Write to buffer ────────────────────────────────
  const buf      = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = `dada-exports-${site}-bulk-template.xlsx`;

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
