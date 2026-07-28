'use client';

import { useState, useRef, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const TABS = [
  { id: 'b2b',    label: 'B2B Products',    color: 'text-rose-700 bg-rose-50 border-rose-200'   },
  { id: 'retail', label: 'Retail Products', color: 'text-blue-700 bg-blue-50 border-blue-200'   },
];

export default function BulkUploadPage() {
  const [site, setSite] = useState('b2b');
  const [mode, setMode] = useState('create');

  // Image upload state
  const [imgFiles, setImgFiles]         = useState([]);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgResult, setImgResult]       = useState(null);
  const [uploadedMap, setUploadedMap]   = useState({});

  // Excel upload state
  const [xlsFile, setXlsFile]           = useState(null);
  const [xlsUploading, setXlsUploading] = useState(false);
  const [xlsResult, setXlsResult]       = useState(null);

  const imgInputRef    = useRef();
  const folderInputRef = useRef();
  const xlsInputRef    = useRef();

  // Strip extension and normalise: collapse spaces around hyphens / replace spaces with hyphens
  // so "RTS 529 3.jpg" and "RTS-529-3.jpg" both become "RTS-529-3"
  const stemFromFilename = (name) => {
    const noExt = name.replace(/\.[^/.]+$/, '');
    return noExt
      .replace(/\s*-\s*/g, '-') // "RTS - 529 - 3" → "RTS-529-3"
      .replace(/\s+/g, '-');    // "RTS 529 3"     → "RTS-529-3"
  };

  /* ── Image / Folder Select ──────────────────────── */
  const handleImgSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    setImgFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...files.filter((f) => !names.has(f.name))];
    });
    setImgResult(null);
    e.target.value = '';
  }, []);

  const handleImgDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    setImgFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...files.filter((f) => !names.has(f.name))];
    });
    setImgResult(null);
  }, []);

  const removeImg = (idx) => setImgFiles((p) => p.filter((_, i) => i !== idx));
  const clearImgs = () => { setImgFiles([]); setImgResult(null); };

  /* ── Upload Images to R2 ──────────────────────────── */
  const uploadImages = async () => {
    if (!imgFiles.length) return;
    setImgUploading(true);
    setImgResult(null);

    try {
      const BATCH = 10;
      const allUploaded = [];
      const allErrors   = [];

      for (let i = 0; i < imgFiles.length; i += BATCH) {
        const batch = imgFiles.slice(i, i + BATCH);
        const fd = new FormData();
        fd.append('site', site);
        batch.forEach((f) => fd.append('files', f));
        const res  = await fetch('/api/admin/bulk-upload/images', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.uploaded) allUploaded.push(...json.uploaded);
        if (json.errors)   allErrors.push(...json.errors);
      }

      const map = {};
      allUploaded.forEach(({ filename, url }) => { map[stemFromFilename(filename)] = url; });
      setUploadedMap(map);
      setImgResult({ uploaded: allUploaded, errors: allErrors });
    } catch (err) {
      setImgResult({ uploaded: [], errors: [{ filename: 'all', error: err.message }] });
    } finally {
      setImgUploading(false);
    }
  };

  /* ── Upload Excel ─────────────────────────────────── */
  const uploadExcel = async () => {
    if (!xlsFile) return;
    setXlsUploading(true);
    setXlsResult(null);
    try {
      const fd = new FormData();
      fd.append('file', xlsFile);
      fd.append('site', site);
      fd.append('mode', mode);
      fd.append('uploadedFiles', JSON.stringify(uploadedMap));
      const res  = await fetch('/api/admin/bulk-upload/products', { method: 'POST', body: fd });
      const json = await res.json();
      setXlsResult(json);
    } catch (err) {
      setXlsResult({ success: false, error: err.message });
    } finally {
      setXlsUploading(false);
    }
  };

  const downloadTemplate = () => window.open(`/api/admin/bulk-upload/template?site=${site}`, '_blank');

  const imgCount = imgFiles.length;

  return (
    <AdminShell title="Bulk Upload">
      <div className="max-w-4xl space-y-6">

        {/* Page Header */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Bulk Upload Products</h2>
          <p className="text-sm text-gray-500 mt-1">Upload images + Excel to create products in bulk. Images already on Cloudflare R2 are fetched automatically.</p>
        </div>

        {/* Site + Mode */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-gray-100">1. Select Site & Mode</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setSite(t.id); setImgResult(null); setXlsResult(null); setImgFiles([]); setXlsFile(null); setUploadedMap({}); }}
                className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${site === t.id ? t.color : 'text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-medium">Mode:</span>
            {[['create','Create only (skip duplicates)'],['upsert','Upsert (overwrite if exists)']].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mode" value={val} checked={mode === val} onChange={() => setMode(val)} className="accent-[#95565E]" />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Template Download */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3 pb-3 border-b border-gray-100">2. Download & Fill Template</h3>
          <p className="text-xs text-gray-400 mb-4">
            Download the Excel template. Fill product data.<br/>
            <strong className="text-gray-600">Tip:</strong> If images are already on R2, no need to upload again — system will auto-fetch by SKU.
          </p>
          <button onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-medium rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download {site === 'b2b' ? 'B2B' : 'Retail'} Template
          </button>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1 pb-3 border-b border-gray-100">
            3. Upload Images <span className="text-gray-400 font-normal">(Optional — skip if already on R2)</span>
          </h3>

          {/* How images are matched */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { icon: '☁️', title: 'Already on R2', desc: 'Skip this step. System auto-constructs URL from SKU: bulk-images/{site}/SKU001-1.jpg' },
              { icon: '📁', title: 'Upload Folder', desc: 'Select entire product images folder at once. All files uploaded together.' },
              { icon: '🖼️', title: 'Upload Files', desc: 'Select individual image files. Mix from multiple folders.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-4">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 mb-4 space-y-0.5">
            <p className="font-semibold">Image naming convention:</p>
            <p>• Single image: <code className="bg-amber-100 px-1 rounded">SKU001.jpg</code></p>
            <p>• Multiple images: <code className="bg-amber-100 px-1 rounded">SKU001-1.jpg</code> &nbsp;<code className="bg-amber-100 px-1 rounded">SKU001-2.jpg</code> &nbsp;<code className="bg-amber-100 px-1 rounded">SKU001-3.jpg</code></p>
            <p>• Supported: JPG, PNG, WebP · Max 10 MB per file</p>
          </div>

          {/* Drop zone */}
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleImgDrop} onClick={() => imgInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#95565E] rounded-2xl p-6 text-center cursor-pointer transition-colors group mb-3">
            <svg className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-[#95565E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">Drag & drop images here, or <span className="text-[#95565E] font-medium">click to browse files</span></p>
            {imgCount > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 bg-[#95565E]/10 text-[#95565E] text-xs font-medium px-3 py-1 rounded-full">
                ✓ {imgCount} image{imgCount !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Folder upload button */}
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-[#95565E] text-sm text-gray-600 hover:text-[#95565E] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
              Upload Folder
            </button>
            {imgCount > 0 && (
              <button type="button" onClick={clearImgs} className="px-4 py-2 rounded-xl border border-red-200 text-sm text-red-500 hover:bg-red-50 transition-colors">
                Clear All ({imgCount})
              </button>
            )}
          </div>

          {/* Hidden inputs */}
          <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImgSelect} />
          <input ref={folderInputRef} type="file" accept="image/*" multiple className="hidden"
            {...{ webkitdirectory: '', directory: '' }}
            onChange={handleImgSelect} />

          {/* File list preview */}
          {imgCount > 0 && imgCount <= 20 && (
            <div className="rounded-xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto mb-3">
              {imgFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-600 font-mono">{f.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => removeImg(i)} className="text-red-400 hover:text-red-600">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {imgCount > 20 && (
            <p className="text-xs text-gray-400 mb-3 ml-1">{imgCount} files selected (showing count only)</p>
          )}

          <button onClick={uploadImages} disabled={!imgCount || imgUploading}
            className="w-full py-3 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {imgUploading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Uploading to Cloudflare R2…</>
              : `Upload ${imgCount > 0 ? imgCount + ' ' : ''}Image${imgCount !== 1 ? 's' : ''} to R2`}
          </button>

          {imgResult && (
            <div className="mt-3 rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex items-center gap-4 text-sm">
                <span className="text-green-700 font-medium">✓ {imgResult.uploaded.length} uploaded to R2</span>
                {imgResult.errors.length > 0 && <span className="text-red-600 font-medium">✗ {imgResult.errors.length} failed</span>}
              </div>
              {imgResult.errors.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 space-y-1">
                  {imgResult.errors.map((e, i) => <p key={i} className="text-xs text-red-600">✗ {e.filename}: {e.error}</p>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Excel Upload */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3 pb-3 border-b border-gray-100">4. Upload Excel & Create Products</h3>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 mb-4 space-y-1">
            <p className="font-semibold">Image matching — how it works (priority order):</p>
            <p>1. <strong>Just uploaded (Step 3)</strong> — freshly uploaded images matched by SKU filename</p>
            <p>2. <strong>imageUrl column</strong> — paste direct URLs in Excel (comma-separated for multiple)</p>
            <p>3. <strong>Auto from R2</strong> — images already on R2 at <code className="bg-blue-100 px-1 rounded">bulk-images/{site}/SKU001-1.jpg</code> are fetched automatically</p>
          </div>

          <label onClick={() => xlsInputRef.current?.click()}
            className="flex items-center gap-4 border-2 border-dashed border-gray-200 hover:border-[#95565E] rounded-2xl p-5 cursor-pointer transition-colors group mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              {xlsFile ? (
                <>
                  <p className="text-sm font-medium text-[#1a1a1a]">{xlsFile.name}</p>
                  <p className="text-xs text-gray-400">{(xlsFile.size / 1024).toFixed(1)} KB · Click to change</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600">Click to select Excel file</p>
                  <p className="text-xs text-gray-400">.xlsx, .xls, .csv supported</p>
                </>
              )}
            </div>
          </label>
          <input ref={xlsInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
            onChange={(e) => { setXlsFile(e.target.files?.[0] || null); setXlsResult(null); }} />

          {/* Status indicator */}
          <div className="flex items-center gap-3 mb-4 text-xs">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${imgResult ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <span>{imgResult ? '✓' : '○'}</span>
              <span>{imgResult ? `${imgResult.uploaded.length} images on R2` : 'No images uploaded (will auto-fetch from R2)'}</span>
            </div>
            {uploadedMap && Object.keys(uploadedMap).length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#95565E]/10 text-[#95565E]">
                <span>✓</span>
                <span>{Object.keys(uploadedMap).length} SKUs mapped</span>
              </div>
            )}
          </div>

          <button onClick={uploadExcel} disabled={!xlsFile || xlsUploading}
            className="w-full py-3 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {xlsUploading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
              : `Process & Create ${site === 'b2b' ? 'B2B' : 'Retail'} Products`}
          </button>

          {/* Results */}
          {xlsResult && (
            <div className="mt-4 rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 flex flex-wrap items-center gap-4 text-sm border-b border-gray-100">
                <span className="font-medium text-gray-700">Total: {xlsResult.total}</span>
                <span className="text-green-700 font-medium">✓ Created: {xlsResult.created}</span>
                {xlsResult.skipped > 0 && <span className="text-amber-600 font-medium">⊘ Skipped: {xlsResult.skipped}</span>}
                {xlsResult.failed  > 0 && <span className="text-red-600 font-medium">✗ Failed: {xlsResult.failed}</span>}
              </div>
              {xlsResult.results?.created?.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-50 max-h-40 overflow-y-auto">
                  <p className="text-xs font-semibold text-green-700 mb-2">Created:</p>
                  {xlsResult.results.created.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
                      <span className="text-green-500">✓</span>
                      <span className="font-mono text-gray-400 w-24 shrink-0">{r.sku}</span>
                      <span className="line-clamp-1 flex-1">{r.name}</span>
                      <span className="text-gray-400 shrink-0">{r.images} img</span>
                    </div>
                  ))}
                </div>
              )}
              {xlsResult.results?.skipped?.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-50 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-amber-700 mb-2">Skipped:</p>
                  {xlsResult.results.skipped.map((r, i) => (
                    <p key={i} className="text-xs text-amber-600 py-0.5">⊘ Row {r.row} · {r.sku} — {r.reason}</p>
                  ))}
                </div>
              )}
              {xlsResult.results?.errors?.length > 0 && (
                <div className="px-4 py-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-red-700 mb-2">Errors:</p>
                  {xlsResult.results.errors.map((r, i) => (
                    <p key={i} className="text-xs text-red-600 py-0.5">✗ Row {r.row} · {r.sku} — {r.error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
