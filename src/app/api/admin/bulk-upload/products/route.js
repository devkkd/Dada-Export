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
 * Resolve image URLs for a SKU — 3 sources in priority order:
 * 1. Freshly uploaded this session (uploadedFiles map)
 * 2. imageUrl column in Excel (comma-separated direct URLs)
 * 3. Auto-list from R2 by SKU prefix (images already on R2)
 */
async function resolveImages(sku, site, uploadedFiles, imageUrlCell) {
  // Source 1: freshly uploaded this session
  const images = [];
  for (let n = 1; n <= 10; n++) {
    const found = uploadedFiles[`${sku}-${n}`];
    if (found) images.push(found);
  }
  if (images.length === 0 && uploadedFiles[sku]) {
    images.push(uploadedFiles[sku]);
  }
  if (images.length > 0) return images;

  // Source 2: imageUrl column in Excel
  if (imageUrlCell) {
    const urls = String(imageUrlCell).split(',').map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) return urls;
  }

  // Source 3: list R2 objects with SKU as prefix
  try {
    // Try bulk-images/{site}/{SKU} first
    let r2 = await listR2Objects(`bulk-images/${site}/${sku}`);
    if (r2.length === 0) {
      // Try without site subfolder
      r2 = await listR2Objects(`bulk-images/${sku}`);
    }
    if (r2.length === 0) {
      // Try root level
      r2 = await listR2Objects(sku);
    }
    if (r2.length > 0) {
      r2.sort((a, b) => a.key.localeCompare(b.key));
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
    const sheet    = workbook.Sheets[workbook.SheetNames[0]];
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
      const sku    = String(row.SKU   || '').trim();
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
