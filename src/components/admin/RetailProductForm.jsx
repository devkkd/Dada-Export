'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DEFAULT_SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// "Free Size" variant is special: it stores custom labels as separate variants
// e.g. admin adds "36", "38-40" → variants = [{size:'Free Size',stock:0},{size:'36',stock:10},{size:'38-40',stock:5}]
const FREE_SIZE = 'Free Size';

const EMPTY_FORM = {
  name:            '',
  slug:            '',
  breadcrumbLabel: '',
  description:     '',
  price:           '',
  mrp:             '',
  fabric:          '',
  category:        '',
  subcategory:     '',
  isActive:        true,
  isFeatured:      false,
  isNewArrival:    false,
  tags:            '',
};

export default function RetailProductForm({ product }) {
  const router        = useRouter();
  const [fromPage, setFromPage] = useState('');
  const isEdit        = !!product;
  const fileRef       = useRef();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    console.log('[RetailForm] URL page param:', pageParam);
    setFromPage(pageParam || '');
  }, []);

  const [form, setForm] = useState(() => {
    if (!product) return EMPTY_FORM;
    return {
      name:            product.name            || '',
      slug:            product.slug            || '',
      breadcrumbLabel: product.breadcrumbLabel || '',
      description:     product.description     || '',
      price:           product.price           ?? '',
      mrp:             product.mrp             ?? '',
      fabric:          product.fabric          || '',
      category:        product.category?._id   || product.category || '',
      subcategory:     product.subcategory?._id || product.subcategory || '',
      isActive:        product.isActive        ?? true,
      isFeatured:      product.isFeatured      ?? false,
      isNewArrival:    product.isNewArrival     ?? false,
      tags:            (product.tags || []).join(', '),
    };
  });

  const [existingImages, setExistingImages]   = useState(product?.images || []);
  const [newImageFiles, setNewImageFiles]     = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // SKU image fetch state
  const [skuInput, setSkuInput]       = useState('');
  const [skuFetching, setSkuFetching] = useState(false);
  const [skuFetchMsg, setSkuFetchMsg] = useState('');

  const [variants, setVariants] = useState(() => {
    if (!product?.variants?.length) {
      return DEFAULT_SIZES.map((size) => ({ size, stock: 0 }));
    }
    const hasCustom = product.variants.some((v) => !DEFAULT_SIZES.includes(v.size));
    if (hasCustom) {
      return product.variants.filter((v) => v.size !== FREE_SIZE);
    }
    return product.variants;
  });

  // Custom size input (shown when Free Size variant is active)
  const [customSizeInput, setCustomSizeInput] = useState('');

  const hasCustomSizes = variants.some((v) => !DEFAULT_SIZES.includes(v.size));
  const isFreeSizeActive = variants.some((v) => v.size === FREE_SIZE) || hasCustomSizes;

  const [prints, setPrints]   = useState(product?.prints || []);
  const [printInput, setPrintInput] = useState('');

  const [colors, setColors] = useState(
    product?.colors?.length ? product.colors : [{ name: '', hex: '#000000' }]
  );

  const [highlights, setHighlights] = useState(
    product?.highlights?.length ? product.highlights : [{ label: '', value: '' }]
  );

  const [keyFeatures, setKeyFeatures] = useState(
    product?.keyFeatures?.length ? product.keyFeatures : ['']
  );

  const [careInstructions, setCareInstructions] = useState(
    product?.careInstructions?.length ? product.careInstructions : ['']
  );

  const [categories, setCategories]     = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [saving, setSaving]             = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    fetch('/api/categories?site=retail')
      .then((r) => r.json())
      .then((json) => { if (json.success) setCategories(json.data); });
  }, []);

  useEffect(() => {
    if (!form.category) { setSubcategories([]); return; }
    const parent = categories.find((c) => String(c._id) === form.category);
    setSubcategories(parent?.subcategories || []);
  }, [form.category, categories]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNameChange = (val) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  // Toggle a default size in/out of variants list
  const toggleVariantSize = (size) => {
    setVariants((prev) => {
      if (size === FREE_SIZE) {
        const currentlyActive = prev.some((v) => v.size === FREE_SIZE || !DEFAULT_SIZES.includes(v.size));
        if (currentlyActive) {
          // Remove Free Size AND all its custom children
          return prev.filter((v) => DEFAULT_SIZES.includes(v.size) && v.size !== FREE_SIZE);
        } else {
          return [...prev, { size: FREE_SIZE, stock: 0 }];
        }
      }
      const exists = prev.find((v) => v.size === size);
      if (exists) {
        return prev.filter((v) => v.size !== size);
      } else {
        return [...prev, { size, stock: 0 }];
      }
    });
  };

  // Add a custom size label (child of Free Size)
  const addCustomVariant = () => {
    const val = customSizeInput.trim();
    if (!val) return;
    // Don't duplicate
    if (variants.find((v) => v.size === val)) { setCustomSizeInput(''); return; }
    // When adding custom size, remove placeholder Free Size variant so Free Size doesn't show
    setVariants((prev) => [...prev.filter((v) => v.size !== FREE_SIZE), { size: val, stock: 0 }]);
    setCustomSizeInput('');
  };

  // Remove a custom size variant
  const removeCustomVariant = (size) => {
    setVariants((prev) => {
      const next = prev.filter((v) => v.size !== size);
      const remainingCustom = next.some((v) => !DEFAULT_SIZES.includes(v.size));
      // If all custom sizes were removed and Free Size is not present, add Free Size variant back
      if (!remainingCustom && !next.some((v) => v.size === FREE_SIZE)) {
        return [...next, { size: FREE_SIZE, stock: 0 }];
      }
      return next;
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImageFiles((p) => [...p, ...files]);
    setNewImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  // Fetch images from R2 by SKU
  const fetchImagesFromR2 = async () => {
    if (!skuInput.trim()) return;
    setSkuFetching(true);
    setSkuFetchMsg('');
    try {
      const res  = await fetch(`/api/admin/r2-images?sku=${encodeURIComponent(skuInput.trim())}&site=retail`);
      const json = await res.json();
      if (json.success && json.images.length > 0) {
        setExistingImages((prev) => {
          const existing = new Set(prev);
          const newUrls = json.images.filter((u) => !existing.has(u));
          return [...prev, ...newUrls];
        });
        setSkuFetchMsg(`✓ Found ${json.images.length} image${json.images.length !== 1 ? 's' : ''} for ${skuInput.trim()}`);
      } else {
        setSkuFetchMsg(`No images found on R2 for SKU: ${skuInput.trim()}`);
      }
    } catch (err) {
      setSkuFetchMsg(`Error: ${err.message}`);
    } finally {
      setSkuFetching(false);
    }
  };

  const uploadImages = async () => {
    if (!newImageFiles.length) return [];
    const urls = [];
    for (const file of newImageFiles) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'retail-products');
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Image upload failed');
      urls.push(json.url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      setUploading(true);
      const newUrls = await uploadImages();
      setUploading(false);

      const payload = {
        ...form,
        price:      form.price === '' ? 0 : Number(form.price),
        mrp:        form.mrp   === '' ? 0 : Number(form.mrp),
        images:     [...existingImages, ...newUrls],
        variants:   variants
          .filter((v) => !(hasCustomSizes && v.size === FREE_SIZE))
          .map((v) => ({ ...v, stock: Number(v.stock) })),
        prints,
        colors,
        highlights: highlights.filter((h) => h.label || h.value),
        keyFeatures:      keyFeatures.filter(Boolean),
        careInstructions: careInstructions.filter(Boolean),
        tags:        form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        category:    form.category    || undefined,
        subcategory: form.subcategory || null,
      };

      const url    = isEdit ? `/api/admin/retail/products/${product._id}` : '/api/admin/retail/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json   = await res.json();
      if (!json.success) throw new Error(json.error || 'Save failed');
      
      // Return to products list with page number if available
      if (fromPage) {
        router.push(`/admin/retail/products?page=${fromPage}`);
      } else {
        router.back();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <button type="button" onClick={() => {
        if (fromPage) {
          router.push(`/admin/retail/products?page=${fromPage}`);
        } else {
          router.back();
        }
      }}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#95565E] transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <div>
        <h2 className="text-xl font-bold text-[#1a1a1a]">{isEdit ? `Edit: ${product.name}` : 'New Retail Product'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update product details.' : 'Fill in the details for this retail product.'}</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>}

      {/* Images */}
      <Section title="Product Images">

        {/* SKU Auto-fetch from R2 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={skuInput}
            onChange={(e) => { setSkuInput(e.target.value); setSkuFetchMsg(''); }}
            onKeyDown={(e) => e.key === 'Enter' && fetchImagesFromR2()}
            placeholder="Enter SKU to fetch images from R2 (e.g. SKU001)"
            className={`${inp} flex-1`}
          />
          <button
            type="button"
            onClick={fetchImagesFromR2}
            disabled={!skuInput.trim() || skuFetching}
            className="px-4 py-2.5 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
          >
            {skuFetching ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Fetching…</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Fetch from R2
              </>
            )}
          </button>
        </div>
        {skuFetchMsg && (
          <p className={`text-xs mb-3 px-3 py-2 rounded-lg ${skuFetchMsg.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {skuFetchMsg}
          </p>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {existingImages.map((url, i) => (
            <div key={`ex-${i}`} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">Main</span>}
            </div>
          ))}
          {newImagePreviews.map((url, i) => (
            <div key={`new-${i}`} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => { setNewImageFiles((p) => p.filter((_, idx) => idx !== i)); setNewImagePreviews((p) => p.filter((_, idx) => idx !== i)); }}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#95565E] flex flex-col items-center justify-center gap-1 transition-colors">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] text-gray-400">Add</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageSelect} />
      </Section>

      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Label>Product Name *</Label>
            <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Women Olive Floral Halter Neck Maxi Dress" className={inp} />
          </div>
          <div>
            <Label>Slug *</Label>
            <input required value={form.slug} onChange={(e) => set('slug', e.target.value)} className={`${inp} font-mono`} />
          </div>
          <div>
            <Label>Breadcrumb Label</Label>
            <input value={form.breadcrumbLabel} onChange={(e) => set('breadcrumbLabel', e.target.value)} placeholder="e.g. Tie-Up Drawstring Flowy A-Line Summer Dress" className={inp} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description *</Label>
            <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inp} resize-none`} />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <Label>Price (₹) *</Label>
            <input type="number" min="0" required value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="1899" className={inp} />
          </div>
          <div>
            <Label>MRP (₹)</Label>
            <input type="number" min="0" value={form.mrp} onChange={(e) => set('mrp', e.target.value)} placeholder="2499" className={inp} />
          </div>
          <div>
            <Label>Fabric</Label>
            <input value={form.fabric} onChange={(e) => set('fabric', e.target.value)} placeholder="100% Premium Rayon" className={inp} />
          </div>
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Category</Label>
            <select value={form.category} onChange={(e) => { set('category', e.target.value); set('subcategory', ''); }} className={`${inp} bg-white`}>
              <option value="">— Select category —</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Subcategory</Label>
            <select value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} disabled={!subcategories.length} className={`${inp} bg-white disabled:opacity-50`}>
              <option value="">— None —</option>
              {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* Size & Stock */}
      <Section title="Size & Stock">
        {/* Toggle buttons for default sizes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {DEFAULT_SIZES.map((size) => {
            const active = size === FREE_SIZE ? isFreeSizeActive : variants.some((v) => v.size === size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleVariantSize(size)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  active
                    ? 'bg-[#95565E] border-[#95565E] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#95565E]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Stock inputs for active default sizes */}
        {variants.filter((v) => DEFAULT_SIZES.includes(v.size) && !(v.size === FREE_SIZE && hasCustomSizes)).length > 0 && (
          <div className="space-y-2 mb-4">
            {variants
              .filter((v) => DEFAULT_SIZES.includes(v.size) && !(v.size === FREE_SIZE && hasCustomSizes))
              .map((v, _) => {
                const globalIdx = variants.findIndex((x) => x.size === v.size);
                return (
                  <div key={v.size} className="flex items-center gap-3">
                    <span className="w-20 text-sm font-medium text-gray-600 shrink-0">{v.size}</span>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => {
                        const n = [...variants];
                        n[globalIdx] = { ...n[globalIdx], stock: e.target.value };
                        setVariants(n);
                      }}
                      placeholder="Stock qty"
                      className={`${inp} w-32`}
                    />
                    <span className="text-xs text-gray-400">units</span>
                  </div>
                );
              })}
          </div>
        )}

        {/* Free Size custom labels — shown only when Free Size is toggled on or custom sizes exist */}
        {isFreeSizeActive && (
          <div className="mt-2 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Custom Size Labels for Free Size
              <span className="ml-1 text-gray-400 font-normal">(optional — add specific labels like "36", "38-40", "S/M")</span>
            </p>

            {/* Custom variant rows with stock */}
            {variants.filter((v) => !DEFAULT_SIZES.includes(v.size)).length > 0 && (
              <div className="space-y-2 mb-3">
                {variants
                  .filter((v) => !DEFAULT_SIZES.includes(v.size))
                  .map((v) => {
                    const globalIdx = variants.findIndex((x) => x.size === v.size);
                    return (
                      <div key={v.size} className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 bg-[#95565E]/10 text-[#95565E] text-sm px-3 py-1 rounded-full border border-[#95565E]/20 w-28 shrink-0 justify-between">
                          <span className="truncate">{v.size}</span>
                          <button
                            type="button"
                            onClick={() => removeCustomVariant(v.size)}
                            className="text-[#95565E]/60 hover:text-[#95565E] transition-colors leading-none shrink-0"
                          >
                            ×
                          </button>
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const n = [...variants];
                            n[globalIdx] = { ...n[globalIdx], stock: e.target.value };
                            setVariants(n);
                          }}
                          placeholder="Stock qty"
                          className={`${inp} w-32`}
                        />
                        <span className="text-xs text-gray-400">units</span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Add custom size input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomVariant(); } }}
                placeholder="e.g. 36, 38-40, S/M, One Size"
                className={`${inp} flex-1`}
              />
              <button
                type="button"
                onClick={addCustomVariant}
                disabled={!customSizeInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-medium transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                + Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Leave empty to use "Free Size" label only, or add specific measurement labels.
            </p>
          </div>
        )}
      </Section>

      {/* Prints */}
      <Section title="Print / Pattern Options">
        <p className="text-xs text-gray-400 mb-3">e.g. Floral, Paisley, Block Print, Abstract, Striped</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {prints.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {p}
              <button type="button" onClick={() => setPrints(prints.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={printInput} onChange={(e) => setPrintInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (printInput.trim()) { setPrints([...prints, printInput.trim()]); setPrintInput(''); } } }}
            placeholder="Type a print and press Enter" className={`${inp} flex-1`} />
          <button type="button" onClick={() => { if (printInput.trim()) { setPrints([...prints, printInput.trim()]); setPrintInput(''); } }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors">Add</button>
        </div>
      </Section>

      {/* Colors */}
      <Section title="Color Options">
        <div className="space-y-3">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="color" value={color.hex} onChange={(e) => { const n = [...colors]; n[i] = { ...n[i], hex: e.target.value }; setColors(n); }}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input value={color.name} onChange={(e) => { const n = [...colors]; n[i] = { ...n[i], name: e.target.value }; setColors(n); }}
                placeholder="Color name" className={`${inp} flex-1`} />
              <button type="button" onClick={() => setColors(colors.filter((_, idx) => idx !== i))} disabled={colors.length === 1}
                className="text-gray-400 hover:text-red-500 disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setColors([...colors, { name: '', hex: '#000000' }])} className="text-sm text-[#95565E] font-medium hover:underline">+ Add color</button>
        </div>
      </Section>

      {/* Highlights */}
      <Section title="Product Highlights">
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 items-center">
              <input value={h.label} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], label: e.target.value }; setHighlights(n); }} placeholder="Label (e.g. Color)" className={inp} />
              <div className="flex gap-2">
                <input value={h.value} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], value: e.target.value }; setHighlights(n); }} placeholder="Value (e.g. Olive Green)" className={`${inp} flex-1`} />
                <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} disabled={highlights.length === 1} className="text-gray-400 hover:text-red-500 disabled:opacity-30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setHighlights([...highlights, { label: '', value: '' }])} className="text-sm text-[#95565E] font-medium hover:underline">+ Add row</button>
        </div>
      </Section>

      {/* Key Features */}
      <Section title="Key Features">
        <BulletList items={keyFeatures} setItems={setKeyFeatures} placeholder="e.g. Premium quality 100% rayon fabric" />
      </Section>

      {/* Care Instructions */}
      <Section title="Care Instructions">
        <BulletList items={careInstructions} setItems={setCareInstructions} placeholder="e.g. Hand wash in cold water" />
      </Section>

      {/* Settings */}
      <Section title="Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Tags (comma separated)</Label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="summer, floral, maxi" className={inp} />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <Toggle label="Active"      checked={form.isActive}     onChange={(v) => set('isActive', v)} />
            <Toggle label="Featured"    checked={form.isFeatured}   onChange={(v) => set('isFeatured', v)} />
            <Toggle label="New Arrival" checked={form.isNewArrival} onChange={(v) => set('isNewArrival', v)} />
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => {
          if (fromPage) {
            router.push(`/admin/retail/products?page=${fromPage}`);
          } else {
            router.back();
          }
        }}
          className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={saving || uploading}
          className="px-8 py-3 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
          {uploading ? <><Spin />Uploading…</> : saving ? <><Spin />Saving…</> : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );
}
function Label({ children }) {
  return <label className="block text-xs font-medium text-gray-600 mb-1.5">{children}</label>;
}
const inp = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition';
function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button type="button" onClick={() => onChange(!checked)} className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#95565E]' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </label>
  );
}
function BulletList({ items, setItems, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-gray-300 shrink-0">•</span>
          <input value={item} onChange={(e) => { const n = [...items]; n[i] = e.target.value; setItems(n); }} placeholder={placeholder} className={`${inp} flex-1`} />
          <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} disabled={items.length === 1} className="text-gray-400 hover:text-red-500 disabled:opacity-30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, ''])} className="text-sm text-[#95565E] font-medium hover:underline">+ Add item</button>
    </div>
  );
}
function Spin() {
  return <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />;
}
