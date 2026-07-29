'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // Coupon object or null
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [usageCriteria, setUsageCriteria] = useState('all');
  const [isActive, setIsActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/retail/coupons');
      const json = await res.json();
      if (json.success) setCoupons(json.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditing(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinOrderAmount('');
    setUsageCriteria('all');
    setIsActive(true);
    setExpiryDate('');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditing(coupon);
    setCode(coupon.code || '');
    setDiscountType(coupon.discountType || 'percentage');
    setDiscountValue(coupon.discountValue || '');
    setMinOrderAmount(coupon.minOrderAmount || '');
    setUsageCriteria(coupon.usageCriteria || 'all');
    setIsActive(coupon.isActive !== undefined ? coupon.isActive : true);
    setExpiryDate(coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '');
    setError('');
    setShowModal(true);
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await fetch(`/api/admin/retail/coupons/${coupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !coupon.isActive } : c))
        );
      }
    } catch (err) {
      console.error('Error toggling coupon status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/retail/coupons/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discountValue) {
      setError('Coupon code and discount value are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount || 0),
      usageCriteria,
      isActive,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
    };

    try {
      const url = editing ? `/api/admin/retail/coupons/${editing._id}` : '/api/admin/retail/coupons';
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchCoupons();
      } else {
        setError(json.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Promo Codes & Coupons">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Retail Coupons & Offers</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage customer promo codes, discount thresholds, and campaign criteria.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#95565E] hover:bg-[#7f4750] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#95565E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs">
          <p className="text-gray-400 font-medium">No coupons created yet. Click Create Coupon to launch an offer!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min Order</th>
                  <th className="px-6 py-4">Target Audience</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% Off`
                        : `₹${coupon.discountValue} Off`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'No Minimum'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        coupon.usageCriteria === 'first_order_only' ? 'bg-amber-50 text-amber-700' :
                        coupon.usageCriteria === 'new_users_only' ? 'bg-blue-50 text-blue-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {coupon.usageCriteria === 'first_order_only' ? 'First Order Only' :
                         coupon.usageCriteria === 'new_users_only' ? 'New Users Only' :
                         'All Users'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.expiryDate
                        ? new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : 'Never Expires'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          coupon.isActive
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100/50'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/50'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-gray-400 hover:text-[#95565E] font-semibold text-xs transition"
                      >
                        Edit
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-gray-400 hover:text-red-600 font-semibold text-xs transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-gray-100 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                {editing ? `Edit Coupon: ${editing.code}` : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm font-mono font-bold"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 150'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Min Order & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 999"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white font-medium"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Audience</label>
                <select
                  value={usageCriteria}
                  onChange={(e) => setUsageCriteria(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#95565E] focus:outline-none text-sm bg-white font-medium"
                >
                  <option value="all">All Users</option>
                  <option value="new_users_only">New Users Only (No Previous Orders)</option>
                  <option value="first_order_only">First Order Only</option>
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#95565E] focus:ring-[#95565E]"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 select-none">
                  Enable coupon immediately (Active)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#95565E] hover:bg-[#7f4750] text-white py-3 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
