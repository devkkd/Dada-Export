'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';

const SITE_BADGE = {
  b2b:    { label: 'B2B',    cls: 'bg-rose-50 text-rose-700'   },
  retail: { label: 'Retail', cls: 'bg-blue-50 text-blue-700'   },
  both:   { label: 'Both',   cls: 'bg-violet-50 text-violet-700' },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('all'); // 'all' | 'b2b' | 'retail'
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null); // category object or null
  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c) => {
    if (tab === 'all') return true;
    return c.site === tab || c.site === 'both';
  });

  // group: top-level first, then subcategories indented under their parent
  const topLevel = filtered.filter((c) => !c.parentId);
  const subs      = filtered.filter((c) => c.parentId);

  const rows = [];
  topLevel.forEach((parent) => {
    rows.push({ ...parent, isParent: true });
    subs
      .filter((s) => String(s.parentId?._id || s.parentId) === String(parent._id))
      .forEach((sub) => rows.push({ ...sub, isParent: false }));
  });
  // orphan subcategories (parent not in filtered)
  subs
    .filter((s) => !topLevel.find((p) => String(p._id) === String(s.parentId?._id || s.parentId)))
    .forEach((s) => rows.push({ ...s, isParent: false }));

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/categories/${deleteId}`, { method: 'DELETE' });
      setDeleteId(null);
      fetchCategories();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell title="Categories">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Categories</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage B2B and Retail product categories</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[['all', 'All'], ['b2b', 'B2B'], ['retail', 'Retail']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${
              tab === val ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No categories yet.</p>
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="mt-4 text-[#95565E] text-sm font-medium hover:underline"
            >
              Create your first category →
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                <th className="text-left px-5 py-3.5 font-medium">Category</th>
                <th className="text-left px-4 py-3.5 font-medium">Site</th>
                <th className="text-left px-4 py-3.5 font-medium hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Order</th>
                <th className="text-left px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {!cat.isParent && <span className="text-gray-300 ml-4 mr-1 text-base">└</span>}
                      {/* image thumbnail */}
                      <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{cat.name}</p>
                        <p className="text-xs text-gray-400">{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SITE_BADGE[cat.site]?.cls}`}>
                      {SITE_BADGE[cat.site]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-gray-500">
                    {cat.isParent ? 'Category' : 'Subcategory'}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => { setEditing(cat); setShowModal(true); }}
                        className="text-gray-400 hover:text-[#95565E] transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteId(cat._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Category Form Modal */}
      {showModal && (
        <CategoryModal
          editing={editing}
          allCategories={categories}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchCategories(); }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">Delete Category</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will also delete all subcategories under it. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ─── Category Form Modal ─────────────────────────────────────── */

function CategoryModal({ editing, allCategories, onClose, onSaved }) {
  const isEdit = !!editing;

  const [form, setForm] = useState({
    name:     editing?.name     || '',
    slug:     editing?.slug     || '',
    site:     editing?.site     || 'both',
    parentId: editing?.parentId?._id || editing?.parentId || '',
    order:    editing?.order    ?? 0,
    isActive: editing?.isActive ?? true,
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(editing?.image || null);
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const fileRef = useRef();

  // top-level categories for parent dropdown (exclude self)
  const parentOptions = allCategories.filter(
    (c) => !c.parentId && String(c._id) !== String(editing?._id)
  );

  // auto-generate slug from name
  const handleNameChange = (val) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      let imageUrl = editing?.image || null;

      // upload new image if selected
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', imageFile);
        fd.append('folder', 'categories');
        const upRes  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const upJson = await upRes.json();
        setUploading(false);
        if (!upJson.success) throw new Error(upJson.error || 'Image upload failed');
        imageUrl = upJson.url;
      }

      const payload = {
        ...form,
        image:    imageUrl,
        parentId: form.parentId || null,
        order:    Number(form.order),
      };

      const url    = isEdit ? `/api/admin/categories/${editing._id}` : '/api/admin/categories';
      const method = isEdit ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Something went wrong');
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-[#1a1a1a]">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Category Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#95565E] transition-colors cursor-pointer bg-gray-50 overflow-hidden flex items-center justify-center"
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="preview" fill className="object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400">Click to upload image</p>
                  <p className="text-xs text-gray-300 mt-0.5">JPG, PNG, WebP · Max 5 MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Dresses"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="e.g. dresses"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] font-mono focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition"
            />
          </div>

          {/* Site + Parent in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Site *</label>
              <select
                required
                value={form.site}
                onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition bg-white"
              >
                <option value="both">Both</option>
                <option value="b2b">B2B only</option>
                <option value="retail">Retail only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition bg-white"
              >
                <option value="">— None (top-level) —</option>
                {parentOptions.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Order + Active in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Display Order</label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                <div
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${form.isActive ? 'bg-[#95565E]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-gray-600 font-medium">Active</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
