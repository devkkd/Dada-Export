'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

const STATUS_CONFIG = {
  new:       { label: 'New',       cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved:  { label: 'Resolved',  cls: 'bg-green-50 text-green-700 border-green-200' },
  closed:    { label: 'Closed',    cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const SOURCE_CONFIG = {
  b2b:    { label: 'B2B',    cls: 'bg-indigo-50 text-indigo-700 border-indigo-150' },
  retail: { label: 'Retail', cls: 'bg-rose-50 text-rose-700 border-rose-150' },
};

export default function CustomerRequestsPage() {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null); // detail drawer
  const [updating, setUpdating]     = useState(false);
  const [noteInput, setNoteInput]   = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      
      const res = await fetch(`/api/customer-inquiry?${params.toString()}`);
      const json = await res.json();
      if (json.success) setInquiries(json.data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, sourceFilter]);

  const filtered = inquiries.filter((inq) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q)  ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.city?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q)
    );
  });

  const openDetail = (inq) => {
    setSelected(inq);
    setNoteInput(inq.adminNote || '');
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/customer-inquiry/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected((prev) => ({ ...prev, status }));
        setInquiries((prev) =>
          prev.map((i) => i._id === id ? { ...i, status } : i)
        );
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/customer-inquiry/${selected._id}`, {
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
        alert('Note saved successfully!');
      }
    } catch (err) {
      alert('Failed to save note: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <AdminShell title="Customer Requests">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Customer Requests</h2>
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

      {/* Filters & Search */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, phone, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Source filter */}
          <div className="flex gap-1 bg-gray-150 p-1 rounded-xl w-fit">
            {[['all', 'All Sources'], ['b2b', 'B2B'], ['retail', 'Retail']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSourceFilter(val)}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  sourceFilter === val ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-gray-155 p-1 rounded-xl w-fit">
            {[['all', 'All Statuses'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  statusFilter === val ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No customer requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3.5 font-medium">Customer Details</th>
                  <th className="text-left px-4 py-3.5 font-medium">Source</th>
                  <th className="text-left px-4 py-3.5 font-medium">Business Context</th>
                  <th className="text-left px-4 py-3.5 font-medium">City</th>
                  <th className="text-left px-4 py-3.5 font-medium">Status</th>
                  <th className="text-left px-4 py-3.5 font-medium">Received Date</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((inq) => (
                  <tr
                    key={inq._id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => openDetail(inq)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1a1a1a]">{inq.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{inq.email}</p>
                      <p className="text-xs text-gray-400">{inq.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${SOURCE_CONFIG[inq.source]?.cls}`}>
                        {SOURCE_CONFIG[inq.source]?.label || inq.source}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 font-medium">{inq.businessType || '—'}</p>
                      <p className="text-xs text-gray-400">{inq.designation || '—'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700">{inq.city || '—'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_CONFIG[inq.status]?.cls}`}>
                        {STATUS_CONFIG[inq.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">
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

      {/* Drawer Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />

          {/* Panel */}
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border mr-2 ${SOURCE_CONFIG[selected.source]?.cls}`}>
                  {selected.source} Request
                </span>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mt-1">{selected.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-6">
              {/* Status Update Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Request Status</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const active = selected.status === key;
                    return (
                      <button
                        key={key}
                        disabled={updating}
                        onClick={() => updateStatus(selected._id, key)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          active
                            ? `${cfg.cls} ring-2 ring-[#95565E]/20 scale-[1.03]`
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-2xl p-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Inquiry Message</h4>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selected.message || 'No message provided.'}
                </p>
              </div>

              {/* Business Info Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Business & Personal Info</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Email Address</p>
                    <a href={`mailto:${selected.email}`} className="font-medium text-[#95565E] hover:underline break-all">
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp / Phone</p>
                    <a
                      href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#95565E] hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Business Type</p>
                    <p className="font-medium text-gray-800">{selected.businessType || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Designation / Role</p>
                    <p className="font-medium text-gray-800">{selected.designation || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">City / State</p>
                    <p className="font-medium text-gray-800">{selected.city || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Admin Note Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administrative Note</h4>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Keep track of conversations, callbacks, business qualification here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white resize-none"
                />
                <button
                  disabled={updating}
                  onClick={saveNote}
                  className="w-full bg-[#95565E] hover:bg-[#7d3f44] text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  {updating ? 'Saving Note...' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
