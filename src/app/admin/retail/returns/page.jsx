'use client';

import { useState, useEffect } from 'react';
import Image                   from 'next/image';
import AdminShell              from '@/components/admin/AdminShell';

const STATUS_CFG = {
  pending:    { label: 'Pending',    cls: 'bg-yellow-50  text-yellow-700  border-yellow-200'  },
  approved:   { label: 'Approved',   cls: 'bg-green-50   text-green-700   border-green-200'   },
  rejected:   { label: 'Rejected',   cls: 'bg-red-50     text-red-700     border-red-200'     },
  picked_up:  { label: 'Picked Up',  cls: 'bg-purple-50  text-purple-700  border-purple-200'  },
  refunded:   { label: 'Refunded',   cls: 'bg-blue-50    text-blue-700    border-blue-200'    },
  exchanged:  { label: 'Exchanged',  cls: 'bg-teal-50    text-teal-700    border-teal-200'    },
};

const TYPE_CFG = {
  return:   { label: '↩ Return',   cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  exchange: { label: '🔄 Exchange', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

export default function AdminReturnsPage() {
  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(null);
  const [saving,       setSaving]       = useState(false);

  // Drawer edit state
  const [statusInput,     setStatusInput]     = useState('');
  const [adminNoteInput,  setAdminNoteInput]  = useState('');
  const [refundAmtInput,  setRefundAmtInput]  = useState('');
  const [refundIdInput,   setRefundIdInput]   = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'all'
        ? `/api/admin/retail/returns?status=${statusFilter}`
        : '/api/admin/retail/returns';
      const res  = await fetch(url);
      const json = await res.json();
      if (json.success) setRequests(json.data);
    } catch (err) {
      console.error('Error fetching returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [statusFilter]); // eslint-disable-line

  const openDrawer = (req) => {
    setSelected(req);
    setStatusInput(req.status     || 'pending');
    setAdminNoteInput(req.adminNote  || '');
    setRefundAmtInput(req.refundAmount != null ? String(req.refundAmount) : '');
    setRefundIdInput(req.refundId   || '');
  };

  const saveChanges = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/retail/returns/${selected._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status:       statusInput,
          adminNote:    adminNoteInput,
          refundAmount: refundAmtInput !== '' ? Number(refundAmtInput) : undefined,
          refundId:     refundIdInput  || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      // Update local list
      setRequests((prev) => prev.map((r) => r._id === selected._id ? json.data : r));
      setSelected(json.data);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = requests.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const u = r.userId || {};
    return (
      r._id?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q)
    );
  });

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  return (
    <AdminShell title="Return & Exchange Requests">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Return & Exchange Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">{requests.length} total requests</p>
        </div>
        {/* Stats */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUS_CFG).map(([key, cfg]) => {
            const count = requests.filter((r) => r.status === key).length;
            return (
              <div key={key} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${cfg.cls}`}>
                {cfg.label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, name, email, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[['all', 'All'], ...Object.entries(STATUS_CFG).map(([k, v]) => [k, v.label])].map(([val, label]) => (
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

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No return/exchange requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3.5 font-medium">Request ID</th>
                  <th className="text-left px-4 py-3.5 font-medium">Customer</th>
                  <th className="text-left px-4 py-3.5 font-medium">Type</th>
                  <th className="text-left px-4 py-3.5 font-medium">Reason</th>
                  <th className="text-left px-4 py-3.5 font-medium">Order</th>
                  <th className="text-left px-4 py-3.5 font-medium">Status</th>
                  <th className="text-left px-4 py-3.5 font-medium">Date</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((req) => {
                  const customer = req.userId || {};
                  const orderId  = req.orderId?._id?.toString() || req.orderId?.toString() || '—';
                  return (
                    <tr
                      key={req._id}
                      onClick={() => openDrawer(req)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-[#95565E] font-semibold">
                        #{req._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#1a1a1a]">{customer.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400">{customer.email || '—'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${TYPE_CFG[req.type]?.cls || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {TYPE_CFG[req.type]?.label || req.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 max-w-[180px] truncate">
                        {req.reason}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-gray-500">
                        #{orderId.slice(-8).toUpperCase()}
                        {req.orderId?.totalAmount != null && (
                          <p className="text-gray-400 font-sans">₹{req.orderId.totalAmount.toLocaleString('en-IN')}</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_CFG[req.status]?.cls || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {STATUS_CFG[req.status]?.label || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-400">{fmtDate(req.createdAt)}</td>
                      <td className="px-4 py-4">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-y-auto">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  {selected.type === 'exchange' ? '🔄 Exchange' : '↩ Return'} Request
                  <span className="font-mono text-sm text-[#95565E] ml-2">#{selected._id?.slice(-8).toUpperCase()}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Status control */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setStatusInput(key)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        statusInput === key
                          ? `${cfg.cls} ring-2 ring-[#95565E]/20 scale-[1.02]`
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
                  <p className="text-sm font-semibold text-gray-800">{selected.userId?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{selected.userId?.email || '—'}</p>
                  <p className="text-xs text-gray-500">{selected.userId?.phone || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Info</h4>
                  <p className="text-xs font-mono text-[#95565E] font-bold">
                    #{(selected.orderId?._id || selected.orderId)?.toString().slice(-8).toUpperCase()}
                  </p>
                  {selected.orderId?.totalAmount != null && (
                    <p className="text-sm font-semibold text-gray-800">₹{selected.orderId.totalAmount.toLocaleString('en-IN')}</p>
                  )}
                  {selected.orderId?.createdAt && (
                    <p className="text-xs text-gray-400">{fmtDate(selected.orderId.createdAt)}</p>
                  )}
                </div>
              </div>

              {/* Return details */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2 text-sm">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Request Details</h4>
                <p><span className="text-amber-700/60 font-medium">Type:</span>{' '}
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${TYPE_CFG[selected.type]?.cls}`}>
                    {TYPE_CFG[selected.type]?.label || selected.type}
                  </span>
                </p>
                <p><span className="text-amber-700/60 font-medium">Reason:</span> <strong>{selected.reason}</strong></p>
                {selected.reasonDetail && <p className="text-amber-800/70 text-xs">{selected.reasonDetail}</p>}
                {selected.exchangeFor && (
                  <p><span className="text-amber-700/60 font-medium">Exchange for:</span> <strong>{selected.exchangeFor}</strong></p>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#FDFBF9]">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.name || ''} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">□</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {[item.size, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 shrink-0">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin response */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Response</h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Note</label>
                  <textarea
                    rows={3}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Approved. Please ship back to our warehouse address. Refund will be processed upon receipt."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white resize-none"
                  />
                </div>

                {/* Refund fields — show when status is refunded or type is return */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Refund Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={refundAmtInput}
                      onChange={(e) => setRefundAmtInput(e.target.value)}
                      placeholder={selected.orderId?.totalAmount || '0'}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Razorpay Refund ID</label>
                    <input
                      type="text"
                      value={refundIdInput}
                      onChange={(e) => setRefundIdInput(e.target.value)}
                      placeholder="rfnd_..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white font-mono"
                    />
                  </div>
                </div>

                <button
                  disabled={saving}
                  onClick={saveChanges}
                  className="w-full bg-[#95565E] hover:bg-[#7d3f44] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
