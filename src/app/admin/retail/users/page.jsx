'use client';

import { useState, useEffect } from 'react';
import Image                   from 'next/image';
import AdminShell              from '@/components/admin/AdminShell';

export default function RetailUsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [selected,setSelected]= useState(null);  // user detail panel

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/retail/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } finally { setLoading(false); }
  };

  const filtered = users.filter((u) =>
    (u.name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  );

  return (
    <AdminShell title="Retail Users">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Retail Customers</h2>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} registered customer{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" placeholder="Search by name, email or phone…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] transition bg-white"
        />
      </div>

      <div className="flex gap-6">
        {/* Users table */}
        <div className={`bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden flex-1 min-w-0 transition-all ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">{search ? 'No customers match your search.' : 'No registered customers yet.'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                    <th className="text-left px-5 py-3.5 font-medium">Customer</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden sm:table-cell">Phone</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">Providers</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Joined</th>
                    <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Orders</th>
                    <th className="px-4 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => (
                    <tr
                      key={u._id}
                      onClick={() => setSelected(u)}
                      className={`hover:bg-gray-50/60 cursor-pointer transition-colors ${selected?._id === u._id ? 'bg-[#95565E]/5' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <Image src={u.image} alt={u.name || ''} width={36} height={36} className="rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#281000]/10 flex items-center justify-center text-[#281000] font-semibold text-sm shrink-0">
                              {(u.name || u.email || '?')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#1a1a1a]">{u.name || <span className="text-gray-400">—</span>}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell text-gray-500">{u.phone || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {(u.providers || []).map((p) => (
                            <span key={p} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm font-medium text-[#1a1a1a]">{u.orderCount ?? 0}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-gray-300 hover:text-[#95565E] transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-[360px] shrink-0">
            <UserDetailPanel user={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}

// ── User detail panel ─────────────────────────────────────────────────────────
function UserDetailPanel({ user: u, onClose }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!u?._id) return;
    setLoading(true);
    fetch(`/api/admin/retail/users/${u._id}/orders`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders); })
      .finally(() => setLoading(false));
  }, [u?._id]);

  const ORDER_COLOURS = {
    placed:     'bg-blue-50   text-blue-700',
    processing: 'bg-amber-50  text-amber-700',
    shipped:    'bg-indigo-50 text-indigo-700',
    delivered:  'bg-green-50  text-green-700',
    cancelled:  'bg-red-50    text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="font-semibold text-[#1a1a1a] text-sm">Customer Details</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {u.image ? (
            <Image src={u.image} alt={u.name || ''} width={44} height={44} className="rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#281000]/10 flex items-center justify-center text-[#281000] font-bold text-lg">
              {(u.name || u.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-[#1a1a1a]">{u.name || '—'}</p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <InfoCell label="Phone"    value={u.phone || '—'} />
          <InfoCell label="Status"   value={u.isActive ? 'Active' : 'Inactive'} color={u.isActive ? 'text-green-600' : 'text-red-500'} />
          <InfoCell label="Joined"   value={new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          <InfoCell label="Providers" value={(u.providers || []).join(', ') || '—'} />
        </div>
      </div>

      {/* Addresses */}
      {u.addresses?.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Addresses ({u.addresses.length})</p>
          <div className="space-y-3">
            {u.addresses.map((a, i) => (
              <div key={i} className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="font-medium text-[#1a1a1a] mb-0.5">{a.name || u.name} · {a.label}</p>
                <p>{a.street}, {a.city}, {a.state} {a.pincode}</p>
                {a.phone && <p className="text-gray-400 mt-0.5">{a.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="px-5 py-4 max-h-[360px] overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Orders ({orders.length})</p>
        {loading ? (
          <p className="text-xs text-gray-400">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400">No orders placed yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="bg-gray-50 rounded-xl px-3.5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[#1a1a1a]">#{o._id.slice(-8).toUpperCase()}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${ORDER_COLOURS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                    {o.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''} · {o.paymentStatus}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value, color = 'text-[#1a1a1a]' }) {
  return (
    <div>
      <p className="text-gray-400 uppercase tracking-wide text-[10px] mb-0.5">{label}</p>
      <p className={`font-medium ${color}`}>{value}</p>
    </div>
  );
}
