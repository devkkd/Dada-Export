import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';
import { connectDB } from '@/lib/db';
import B2BProduct from '@/models/b2b/B2BProduct';
import RetailProduct from '@/models/retail/RetailProduct';
import Category from '@/models/Category';
import { listR2Objects } from '@/lib/cloudflare';

/* ── Helpers ──────────────────────────────────────────────────── */

const splitCSV = (str) =>
  str ? String(str).split(',').map((s) => s.trim()).filter(Boolean) : [];

const splitPairs = (str, sep = '|', kv = ':') =>
  str
    ? String(str).split(sep).map((s) => {
        const [label, ...rest] = s.split(kv);
        return { label: label?.trim() || '', value: rest.join(kv).trim() };
      }).filter((p) => p.label)
    : [];

const splitColors = (str) =>
  str
    ? String(str).split(',').map((s) => {
        const [name, hex] = s.split(':');
        return { name: name?.trim() || '', hex: hex?.trim() || '#000000' };
      }).filter((c) => c.name)
    : [];

const splitVariants = (str) =>
  str
    ? String(str).split(',').map((s) => {
        const [size, stock] = s.split(':');
        return { size: size?.trim() || '', stock: parseInt(stock) || 0 };
      }).filter((v) => v.size)
    : [];

const toSlug = (str) =>
  String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function makeUniqueSlug(name, sku, Model) {
  const base = toSlug(name);
  const exists = await Model.findOne({ slug: base }).lean();
  if (!exists) return base;
  const withSku = toSlug(`${name}-${sku}`);
  const existsWithSku = await Model.findOne({ slug: withSku }).lean();
  if (!existsWithSku) return withSku;
  return toSlug(`${name}-${sku}-${Date.now()}`);
}

/**
 * Normalise a SKU string for consistent key lookup:
 * collapse whitespace around hyphens, replace remaining spaces with hyphens, trim.
 * e.g. "RTS- 611" → "RTS-611", "RTS 529" → "RTS-529"
 */
const normaliseSku = (sku) =>
  String(sku)
    .trim()
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '-');

/**
 * Resolve image URLs for a SKU — 3 sources in priority order:
 * 1. Freshly uploaded this session (uploadedFiles map)
 * 2. imageUrl column in Excel (comma-separated direct URLs)
 * 3. Auto-list from R2 — searches entire bucket for any object whose key
 *    contains the SKU as a path segment (handles any folder nesting)
 */
async function resolveImages(sku, site, uploadedFiles, imageUrlCell) {
  const normSku = normaliseSku(sku);

  // Source 1: freshly uploaded this session
  const images = [];
  for (let n = 1; n <= 10; n++) {
    const found = uploadedFiles[`${normSku}-${n}`] || uploadedFiles[`${sku}-${n}`];
    if (found) images.push(found);
  }
  if (images.length === 0) {
    const found = uploadedFiles[normSku] || uploadedFiles[sku];
    if (found) images.push(found);
  }
  if (images.length > 0) return images;

  // Source 2: imageUrl column in Excel
  if (imageUrlCell) {
    const urls = String(imageUrlCell).split(',').map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) return urls;
  }

  // Source 3: Search R2 — try progressively broader prefixes to find SKU folder
  // Handles structures like:
  //   bulk-images/b2b/RTS-504/RTS-504-1.JPG
  //   bulk-images/b2b/web/web/RTS-504/RTS-504-1.JPG
  //   bulk-images/RTS-504-1.JPG
  try {
    const prefixesToTry = [
      `bulk-images/${site}/${normSku}/`,   // direct: bulk-images/b2b/RTS-504/
      `bulk-images/${site}/${normSku}-`,   // flat:   bulk-images/b2b/RTS-504-1.jpg
      `bulk-images/${normSku}/`,           // no site folder
      `bulk-images/${normSku}-`,
    ];

    // Also do a broad search under bulk-images/{site}/ and filter by SKU in key
    // This catches arbitrary nesting like web/web/RTS-504/
    let r2 = [];
    for (const prefix of prefixesToTry) {
      r2 = await listR2Objects(prefix);
      if (r2.length > 0) break;
    }

    // Broad fallback: list everything under bulk-images/{site}/ and filter by SKU
    if (r2.length === 0) {
      const all = await listR2Objects(`bulk-images/${site}/`);
      // Match objects whose key contains /{SKU}/ or /{SKU}- (case-insensitive)
      const skuUpper = normSku.toUpperCase();
      const skuLower = normSku.toLowerCase();
      r2 = all.filter((o) => {
        const k = o.key;
        return (
          k.includes(`/${normSku}/`) || k.includes(`/${normSku}-`) ||
          k.includes(`/${skuUpper}/`) || k.includes(`/${skuUpper}-`) ||
          k.includes(`/${skuLower}/`) || k.includes(`/${skuLower}-`)
        );
      });
    }

    if (r2.length > 0) {
      // Sort so -1 comes before -2 etc.
      r2.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
      return r2.map((o) => o.url);
    }
  } catch (err) {
    console.warn(`[bulk-upload] R2 list failed for SKU ${sku}:`, err.message);
  }

  return []; // no images found
}

/* ── Route Handler ──────────────────────────────────────────── */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file     = formData.get('file');
    const site     = formData.get('site') || 'b2b';
    const mode     = formData.get('mode') || 'create';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No Excel file provided' }, { status: 400 });
    }

    // Parse Excel
    const buffer   = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Find the sheet that has the product data (contains 'SKU' column header)
    let sheetName = workbook.SheetNames[0];
    for (const name of workbook.SheetNames) {
      const sh = workbook.Sheets[name];
      const range = XLSX.utils.sheet_to_json(sh, { header: 1 });
      const firstRow = range[0] || [];
      const hasSku = firstRow.some((h) => String(h || '').trim().toUpperCase() === 'SKU');
      if (hasSku) {
        sheetName = name;
        break;
      }
    }

    const sheet    = workbook.Sheets[sheetName];
    const rows     = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows.length) {
      return NextResponse.json({ success: false, error: 'Excel sheet is empty' }, { status: 400 });
    }

    await connectDB();

    // Category map: name → _id (case-insensitive)
    const allCats   = await Category.find({ isActive: true }).lean();
    const catByName = {};
    allCats.forEach((c) => { catByName[c.name.toLowerCase()] = c._id; });

    // Parse uploaded files map ONCE (outside loop)
    let uploadedFiles = {};
    try {
      uploadedFiles = JSON.parse(formData.get('uploadedFiles') || '{}');
    } catch (_) {}

    const Model   = site === 'b2b' ? B2BProduct : RetailProduct;
    const created = [];
    const skipped = [];
    const errors  = [];

    for (let i = 0; i < rows.length; i++) {
      const row    = rows[i];
      const rowNum = i + 2;
      const sku    = normaliseSku(String(row.SKU || ''));
      const name   = String(row.name  || '').trim();

      if (!sku || !name) {
        errors.push({ row: rowNum, sku: sku || '—', error: 'SKU and name are required' });
        continue;
      }

      try {
        // Resolve images (3-source priority)
        const images = await resolveImages(sku, site, uploadedFiles, row.imageUrl);

        // Category validation
        const catName    = String(row.category    || '').trim().toLowerCase();
        const subcatName = String(row.subcategory || '').trim().toLowerCase();

        if (!catName) {
          errors.push({ row: rowNum, sku, error: 'Category is required' });
          continue;
        }
        const categoryId = catByName[catName];
        if (!categoryId) {
          errors.push({ row: rowNum, sku, error: `Category "${row.category}" not found. Create it in admin first.` });
          continue;
        }
        const subcategoryId = subcatName ? catByName[subcatName] : null;
        if (subcatName && !subcategoryId) {
          errors.push({ row: rowNum, sku, error: `Subcategory "${row.subcategory}" not found. Create it in admin first.` });
          continue;
        }

        // Auto-generate slug — NO duplicate declaration
        const slug = row.slug && String(row.slug).trim()
          ? String(row.slug).trim()
          : await makeUniqueSlug(name, sku, Model);

        // Check existing
        const existing = await Model.findOne({ slug }).lean();
        if (existing && mode === 'create') {
          skipped.push({ row: rowNum, sku, name, reason: `Slug "${slug}" already exists` });
          continue;
        }

        if (site === 'b2b') {
          const data = {
            name, slug,
            breadcrumbLabel:  String(row.breadcrumbLabel  || '').trim(),
            description:      String(row.description      || '').trim(),
            images,
            category:         categoryId,
            subcategory:      subcategoryId,
            price:            parseFloat(row.price)  || 0,
            moq:              parseInt(row.moq)       || 50,
            fabric:           String(row.fabric       || '').trim(),
            sizes:            splitCSV(row.sizes),
            colors:           splitColors(row.colors),
            highlights:       splitPairs(row.highlights),
            keyFeatures:      String(row.keyFeatures      || '').split('|').map((s) => s.trim()).filter(Boolean),
            careInstructions: String(row.careInstructions || '').split('|').map((s) => s.trim()).filter(Boolean),
            tags:             splitCSV(row.tags),
            isActive:         row.isActive     !== 'false' && row.isActive     !== '0',
            isFeatured:       row.isFeatured   === 'true'  || row.isFeatured   === '1',
            isNewArrival:     row.isNewArrival === 'true'  || row.isNewArrival === '1',
          };
          if (existing) await B2BProduct.findByIdAndUpdate(existing._id, data);
          else          await B2BProduct.create(data);

        } else {
          const data = {
            name, slug,
            breadcrumbLabel:  String(row.breadcrumbLabel  || '').trim(),
            description:      String(row.description      || '').trim(),
            images,
            category:         categoryId,
            subcategory:      subcategoryId,
            price:            parseFloat(row.price) || 0,
            mrp:              parseFloat(row.mrp)   || 0,
            fabric:           String(row.fabric     || '').trim(),
            variants:         splitVariants(row.variants),
            prints:           splitCSV(row.prints),
            colors:           splitColors(row.colors),
            highlights:       splitPairs(row.highlights),
            keyFeatures:      String(row.keyFeatures      || '').split('|').map((s) => s.trim()).filter(Boolean),
            careInstructions: String(row.careInstructions || '').split('|').map((s) => s.trim()).filter(Boolean),
            tags:             splitCSV(row.tags),
            isActive:         row.isActive     !== 'false' && row.isActive     !== '0',
            isFeatured:       row.isFeatured   === 'true'  || row.isFeatured   === '1',
            isNewArrival:     row.isNewArrival === 'true'  || row.isNewArrival === '1',
          };
          if (existing) await RetailProduct.findByIdAndUpdate(existing._id, data);
          else          await RetailProduct.create(data);
        }

        created.push({ row: rowNum, sku, name, images: images.length });

      } catch (err) {
        errors.push({ row: rowNum, sku, error: err.message });
      }
    }

    return NextResponse.json({
      success: true, site,
      total:   rows.length,
      created: created.length,
      skipped: skipped.length,
      failed:  errors.length,
      results: { created, skipped, errors },
    });

  } catch (err) {
    console.error('[bulk-upload/products]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
