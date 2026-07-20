'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminShell from '@/components/admin/AdminShell';

const STATUS_CONFIG = {
  placed:     { label: 'Placed',     cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  processing: { label: 'Processing', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped:    { label: 'Shipped',    cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-50 text-green-700 border-green-200' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-50 text-red-700 border-red-200' },
};

const PAYMENT_CONFIG = {
  pending: { label: 'Pending', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  paid:    { label: 'Paid',    cls: 'bg-green-50 text-green-700 border-green-200' },
  failed:  { label: 'Failed',  cls: 'bg-red-50 text-red-700 border-red-200' },
};

export default function RetailOrdersPage() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null); // details drawer
  const [updating, setUpdating]     = useState(false);
  
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [adminNoteInput, setAdminNoteInput]   = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== 'all' 
        ? `/api/admin/retail/orders?status=${statusFilter}` 
        : '/api/admin/retail/orders';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const customer = o.userId || {};
    const address = o.shippingAddress || {};
    return (
      o._id?.toLowerCase().includes(q) ||
      customer.name?.toLowerCase().includes(q) ||
      customer.email?.toLowerCase().includes(q) ||
      customer.phone?.toLowerCase().includes(q) ||
      address.name?.toLowerCase().includes(q) ||
      address.phone?.toLowerCase().includes(q) ||
      address.city?.toLowerCase().includes(q) ||
      o.paymentId?.toLowerCase().includes(q)
    );
  });

  const openDrawer = (order) => {
    setSelected(order);
    setTrackingIdInput(order.trackingId || '');
    setAdminNoteInput(order.adminNote || '');
  };

  const updateStatus = async (id, orderStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/retail/orders/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected((prev) => ({ ...prev, orderStatus }));
        setOrders((prev) =>
          prev.map((o) => o._id === id ? { ...o, orderStatus } : o)
        );
      }
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const saveDetails = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/retail/orders/${selected._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          trackingId: trackingIdInput,
          adminNote:  adminNoteInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelected((prev) => ({ ...prev, trackingId: trackingIdInput, adminNote: adminNoteInput }));
        setOrders((prev) =>
          prev.map((o) => o._id === selected._id ? { ...o, trackingId: trackingIdInput, adminNote: adminNoteInput } : o)
        );
        alert('Order details saved successfully!');
      }
    } catch (err) {
      alert('Error saving order details: ' + err.message);
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
    <AdminShell title="Retail Orders">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Retail Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>
        {/* Stats */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = orders.filter((o) => o.orderStatus === key).length;
            return (
              <div key={key} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${cfg.cls}`}>
                {cfg.label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, customer name, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#95565E]/30 focus:border-[#95565E] bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[['all', 'All Orders'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([val, label]) => (
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3.5 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3.5 font-medium">Customer</th>
                  <th className="text-left px-4 py-3.5 font-medium">Items</th>
                  <th className="text-left px-4 py-3.5 font-medium">Total Amount</th>
                  <th className="text-left px-4 py-3.5 font-medium">Payment</th>
                  <th className="text-left px-4 py-3.5 font-medium">Status</th>
                  <th className="text-left px-4 py-3.5 font-medium">Date</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const customer = order.userId || {};
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-55/50 transition-colors cursor-pointer"
                      onClick={() => openDrawer(order)}
                    >
                      <td className="px-5 py-4 font-mono text-xs text-[#95565E] font-semibold">
                        #{order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#1a1a1a]">{customer.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400">{customer.email || 'No email'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-700">
                          {order.items?.length || 0} Item{(order.items?.length !== 1) ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {order.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${PAYMENT_CONFIG[order.paymentStatus]?.cls || 'bg-gray-50 text-gray-600'}`}>
                          {PAYMENT_CONFIG[order.paymentStatus]?.label || order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_CONFIG[order.orderStatus]?.cls || 'bg-gray-50 text-gray-600'}`}>
                          {STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
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

      {/* Order Details Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />

          {/* Side Panel */}
          <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Order Details <span className="font-mono text-sm text-[#95565E]">#{selected._id?.toUpperCase()}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 px-6 py-6 space-y-6">
              {/* Order Status Control */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const active = selected.orderStatus === key;
                    return (
                      <button
                        key={key}
                        disabled={updating}
                        onClick={() => updateStatus(selected._id, key)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          active
                            ? `${cfg.cls} ring-2 ring-[#95565E]/20 scale-[1.02]`
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                  {selected.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 items-center bg-[#FDFBF9]">
                      <div className="w-14 h-18 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-1">
                          {item.size && <span>Size: <strong className="text-gray-600">{item.size}</strong></span>}
                          {item.color && <span>Color: <strong className="text-gray-600">{item.color}</strong></span>}
                          <span>Qty: <strong className="text-gray-600">{item.quantity}</strong></span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-gray-800 text-sm">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Total: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-[#F9F6F2] font-semibold text-sm">
                    <span className="text-gray-600">Grand Total</span>
                    <span className="text-lg text-[#95565E]">₹{(selected.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Profile</h4>
                  <div className="text-sm space-y-2">
                    <p><strong className="text-gray-500 font-medium">Name:</strong> {selected.userId?.name || 'Guest User'}</p>
                    <p><strong className="text-gray-500 font-medium">Email:</strong> {selected.userId?.email || '—'}</p>
                    <p><strong className="text-gray-500 font-medium">Phone:</strong> {selected.userId?.phone || '—'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-gray-800">{selected.shippingAddress?.name || 'Recipients Name'}</p>
                    <p className="text-gray-600">{selected.shippingAddress?.street}</p>
                    <p className="text-gray-600">{selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}</p>
                    {selected.shippingAddress?.phone && <p className="text-xs text-gray-400 mt-1">Contact: {selected.shippingAddress?.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Info</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Payment Status</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border inline-block mt-0.5 ${PAYMENT_CONFIG[selected.paymentStatus]?.cls}`}>
                      {PAYMENT_CONFIG[selected.paymentStatus]?.label || selected.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Razorpay Payment ID</p>
                    <p className="font-mono text-xs text-gray-800 mt-0.5 select-all">{selected.paymentId || 'No Razorpay Transaction ID'}</p>
                  </div>
                </div>
              </div>

              {/* Admin Note & Tracking ID */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fulfillment & Shipping Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Courier Tracking ID</label>
                    <input
                      type="text"
                      placeholder="e.g. AWB128793081"
                      value={trackingIdInput}
                      onChange={(e) => setTrackingIdInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Notes / Remarks</label>
                    <textarea
                      rows={1}
                      placeholder="Add processing notes..."
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white resize-none"
                    />
                  </div>
                </div>

                <button
                  disabled={updating}
                  onClick={saveDetails}
                  className="w-full bg-[#95565E] hover:bg-[#7d3f44] text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  {updating ? 'Saving Details...' : 'Save Tracking Info & Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
