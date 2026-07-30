'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';

const STATUS_CONFIG = {
  new:        { label: 'New',       cls: 'bg-blue-50 text-blue-700 border-blue-200'   },
  contacted:  { label: 'Contacted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  converted:  { label: 'Converted', cls: 'bg-green-50 text-green-700 border-green-200' },
  closed:     { label: 'Closed',    cls: 'bg-gray-100 text-gray-500 border-gray-200'   },
};

const TYPE_CONFIG = {
  single: { label: 'Single',   cls: 'bg-violet-50 text-violet-700' },
  cart:   { label: 'Cart',     cls: 'bg-rose-50 text-rose-700'     },
};

export default function B2BInquiriesPage() {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null);
  const [updating, setUpdating]     = useState(false);
  const [noteInput, setNoteInput]   = useState('');
  const [page, setPage]             = useState(1);
  const PAGE_SIZE                   = 20;

  const fetchInquiries = async (status) => {
    setLoading(true);
    try {
      const url = status && status !== 'all'
        ? `/api/b2b/inquiry?status=${status}`
        : '/api/b2b/inquiry';
      const res  = await fetch(url);
      const json = await res.json();
      if (json.success) setInquiries(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(statusFilter); }, [statusFilter]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const filtered = inquiries.filter((inq) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q)  ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.company?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openDetail = (inq) => {
    setSelected(inq);
    setNoteInput(inq.adminNote || '');
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res  = await fetch(`/api/b2b/inquiry/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        // Update both the drawer and the list
        setSelected((prev) => ({ ...prev, status }));
        setInquiries((prev) =>
          prev.map((i) => i._id === id ? { ...i, status } : i)
        );
      }
    } finally {
      setUpdating(false);
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/b2b/inquiry/${selected._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ adminNote: noteInput }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected((prev) => ({ ...prev, adminNote: noteInput }));
        setInquiries((prev) =>
          prev.map((i) => i._id === selected._id ? { ...i, adminNote: noteInput } : i)
        );
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <AdminShell title="B2B Inquiries">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">B2B Inquiries</h2>
          <p className="text-sm text-gray-500 mt-0.5">{inquiries.length} total</p>
        </div>
        {/* Stats */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = inquiries.filter((i) => i.status === key).length;
            return (
              <div key={key} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${cfg.cls}`}>
                {cfg.label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-80">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, email, phone…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] bg-white" />
        </div>
        {/* Status filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[['all', 'All'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${statusFilter === val ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No inquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3.5 font-medium">Buyer</th>
                  <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Business</th>
                  <th className="text-left px-4 py-3.5 font-medium hidden sm:table-cell">Products</th>
                  <th className="text-left px-4 py-3.5 font-medium">Type</th>
                  <th className="text-left px-4 py-3.5 font-medium">Status</th>
                  <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((inq) => (
                  <tr key={inq._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => openDetail(inq)}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1a1a1a]">{inq.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{inq.email}</p>
                      <p className="text-xs text-gray-400">{inq.phone}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{inq.company || '—'}</p>
                      <p className="text-xs text-gray-400">{inq.country}{inq.city ? `, ${inq.city}` : ''}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex gap-1.5">
                        {(inq.products || []).slice(0, 3).map((p, i) => (
                          <div key={i} className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {p.image ? (
                              <Image src={p.image} alt={p.name || ''} width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                        {inq.products?.length > 3 && (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                            +{inq.products.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{inq.products?.length || 0} product{inq.products?.length !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_CONFIG[inq.type]?.cls || ''}`}>
                        {TYPE_CONFIG[inq.type]?.label || inq.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_CONFIG[inq.status]?.cls}`}>
                        {STATUS_CONFIG[inq.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-400">
                      {formatDate(inq.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-400 text-xs">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === p ? 'bg-[#95565E] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                )
              )}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />

          {/* Panel */}
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-semibold text-[#1a1a1a]">{selected.name}</h3>
                <p className="text-xs text-gray-400">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-6">
              {/* Status change */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => updateStatus(selected._id, key)} disabled={updating}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${selected.status === key ? cfg.cls : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyer details */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer Details</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row label="Name"        value={selected.name} />
                  <Row label="Designation" value={selected.designation} />
                  <Row label="Email"       value={<a href={`mailto:${selected.email}`} className="text-[#95565E] hover:underline">{selected.email}</a>} />
                  <Row label="Phone"       value={<a href={`tel:${selected.phone}`} className="text-[#95565E] hover:underline">{selected.phone}</a>} />
                </div>
              </div>

              {/* Business details */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Business Details</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row label="Company"       value={selected.company} />
                  <Row label="Business Type" value={selected.businessType} />
                  <Row label="Country"       value={selected.country} />
                  <Row label="City"          value={selected.city} />
                </div>
              </div>

              {/* Order requirements */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Requirements</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row label="Est. Quantity" value={selected.quantity} />
                  {selected.message && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Message</p>
                      <p className="text-sm text-[#1a1a1a] whitespace-pre-wrap">{selected.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              {selected.products?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Products ({selected.products.length}) ·{' '}
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${TYPE_CONFIG[selected.type]?.cls}`}>
                      {TYPE_CONFIG[selected.type]?.label}
                    </span>
                  </p>
                  <div className="space-y-3">
                    {selected.products.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {p.image ? (
                            <Image src={p.image} alt={p.name || ''} width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {[p.size && `Size: ${p.size}`, p.color && `Color: ${p.color}`, p.quantity && `Qty: ${p.quantity}`].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin note */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Admin Note</p>
                <textarea rows={3} value={noteInput} onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add internal notes about this inquiry…"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition resize-none" />
                <button onClick={saveNote} disabled={updating}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#95565E] hover:bg-[#7f4750] text-white text-xs font-semibold transition-colors disabled:opacity-60">
                  {updating ? 'Saving…' : 'Save Note'}
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <a href={`mailto:${selected.email}?subject=Re: Your B2B Inquiry — Dada Exports`}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
                <a href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selected.name}, regarding your inquiry to Dada Exports...`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5c] text-white text-center text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.5.73 4.93 2.1 7L3.75 29l6.4-1.67a13.15 13.15 0 005.89 1.4c7.2 0 13.04-5.74 13.04-12.82C29.08 8.74 23.24 3 16.04 3zm7.58 18.1c-.32.89-1.88 1.7-2.6 1.81-.67.1-1.52.15-2.45-.15-.57-.18-1.31-.42-2.26-.83-3.97-1.72-6.56-5.73-6.76-6-.19-.27-1.61-2.11-1.61-4.02 0-1.91.99-2.84 1.34-3.23.35-.39.76-.49 1.02-.49.25 0 .51 0 .73.01.24.01.56-.09.87.65.32.77 1.08 2.66 1.18 2.86.1.2.16.43.03.7-.13.27-.19.43-.38.66-.19.23-.4.51-.57.69-.19.19-.39.4-.17.79.22.39.98 1.61 2.1 2.61 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.26.95-1.1 1.2-1.48.25-.38.51-.32.86-.19.35.13 2.24 1.05 2.62 1.24.38.19.63.29.73.45.09.16.09.95-.23 1.84z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-28 shrink-0 text-xs pt-0.5">{label}</span>
      <span className="text-[#1a1a1a] flex-1">{value}</span>
    </div>
  );
}
