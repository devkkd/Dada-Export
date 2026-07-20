'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams }    from 'next/navigation';
import Image                             from 'next/image';
import { useRetailAuth }                 from '@/context/RetailAuthContext';
import LoginModal                         from '@/components/retail/LoginModel';

const TABS = {
  HOME:      'home',
  ORDERS:    'orders',
  ADDRESSES: 'addresses',
  ADD_ADDR:  'add-address',
  EDIT_ADDR: 'edit-address',
};

const ORDER_COLOURS = {
  placed:     'bg-blue-50   text-blue-700',
  processing: 'bg-amber-50  text-amber-700',
  shipped:    'bg-indigo-50 text-indigo-700',
  delivered:  'bg-green-50  text-green-700',
  cancelled:  'bg-red-50    text-red-600',
};

const emptyAddr = {
  label: 'Home', name: '', phone: '',
  street: '', city: '', state: '', pincode: '',
  lat: null, lon: null,
  isDefault: false,
};

function AccountContent() {
  const { user, isLoggedIn, isLoading, logout, refreshUser } = useRetailAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [tab,           setTab]           = useState(TABS.HOME);

  useEffect(() => {
    if (isLoggedIn && loginModalOpen) {
      setLoginModalOpen(false);
    }
  }, [isLoggedIn, loginModalOpen]);
  const [addresses,     setAddresses]     = useState([]);
  const [addrLoading,   setAddrLoading]   = useState(false);
  const [editAddr,      setEditAddr]      = useState(null);
  const [addrForm,      setAddrForm]      = useState(emptyAddr);
  const [addrSaving,    setAddrSaving]    = useState(false);
  const [orders,        setOrders]        = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showAddrForm,  setShowAddrForm]  = useState(false);
  const [mapError,      setMapError]      = useState('');

  // URL-driven tab
  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && Object.values(TABS).includes(t)) setTab(t);
  }, [searchParams]);

  // Auth guard — wait for loading to complete before redirecting
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      // Instead of navigating away, show the login modal so users can authenticate
      setLoginModalOpen(true);
    }
  }, [isLoggedIn, isLoading, router]);

  // On mount, force a refresh — handles Google OAuth landing here with a fresh cookie
  useEffect(() => {
    refreshUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load addresses when on address tabs
  useEffect(() => {
    if ([TABS.ADDRESSES, TABS.ADD_ADDR, TABS.EDIT_ADDR].includes(tab) && isLoggedIn) {
      fetchAddresses();
    }
  }, [tab, isLoggedIn]); // eslint-disable-line

  // Load orders when on orders tab
  useEffect(() => {
    if (tab === TABS.ORDERS && isLoggedIn) fetchOrders();
  }, [tab, isLoggedIn]); // eslint-disable-line

  const fetchAddresses = async () => {
    setAddrLoading(true);
    try {
      const res  = await fetch('/api/retail/auth/addresses', { credentials: 'include' });
      if (res.status === 401) {
        // Not authenticated — prompt login and attempt a refresh
        setLoginModalOpen(true);
        return;
      }
      const data = await res.json();
      if (data.success) setAddresses(data.addresses || []);
    } finally { setAddrLoading(false); }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res  = await fetch('/api/retail/orders/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } finally { setOrdersLoading(false); }
  };

  const saveAddress = async () => {
    if (!addrForm.street?.trim() || !addrForm.city?.trim() || !addrForm.pincode?.trim()) {
      alert('Street, city and pincode are required');
      return;
    }
    setAddrSaving(true);
    try {
      let res, data;
      if (editAddr) {
        res  = await fetch(`/api/retail/auth/addresses/${editAddr._id}`, {
          method: 'PUT', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addrForm),
        });
        data = await res.json();
      } else {
        res  = await fetch('/api/retail/auth/addresses', {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addrForm),
        });
        data = await res.json();
      }
      if (data.success) {
        setAddresses(data.addresses || []);
        setShowAddrForm(false);
        setEditAddr(null);
        setAddrForm(emptyAddr);
        setTab(TABS.ADDRESSES);
      }
    } finally { setAddrSaving(false); }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Remove this address?')) return;
    const res  = await fetch(`/api/retail/auth/addresses?id=${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (data.success) setAddresses(data.addresses || []);
  };

  const startEdit = (addr) => {
    setEditAddr(addr);
    setAddrForm({
      label:     addr.label     || 'Home',
      name:      addr.name      || '',
      phone:     addr.phone     || '',
      street:    addr.street    || '',
      city:      addr.city      || '',
      state:     addr.state     || '',
      pincode:   addr.pincode   || '',
      isDefault: addr.isDefault || false,
    });
    setShowAddrForm(true);
    setTab(TABS.ADD_ADDR);
  };

  const goToAddAddress = () => {
    setEditAddr(null);
    setAddrForm(emptyAddr);
    setShowAddrForm(true);
    setTab(TABS.ADD_ADDR);
  };

  // Geolocation for map
  const useCurrentLocation = () => {
    setMapError('');
    if (!navigator.geolocation) { setMapError('failed'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lng}`);
          const json = await res.json();
          if (!res.ok || !json.success) {
            // fallback: still set coords so map recenters, but mark mapError
            setAddrForm(prev => ({ ...prev, lat, lon: lng }));
            setMapError('failed');
            return;
          }
          const a = json.data.address || {};
          setAddrForm(prev => ({
            ...prev,
            street:  [a.house_number, a.road].filter(Boolean).join(', '),
            city:    a.city || a.town || a.village || '',
            state:   a.state || '',
            pincode: a.postcode || '',
            lat,
            lon: lng,
          }));
        } catch {
          setAddrForm(prev => ({ ...prev, lat, lon: lng }));
          setMapError('failed');
        }
      },
      (err) => {
        if (err && err.code === 1) {
          setMapError('permission-denied');
        } else {
          setMapError('failed');
        }
      },
      { timeout: 8000 }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-[#F7F4EF] min-h-screen flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, render the login modal and a friendly message while waiting
  if (!isLoggedIn || !user) {
    return (
      <div className="bg-[#F7F4EF] min-h-screen flex items-center justify-center">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-12 pb-24 text-center">
          <p className="text-[#1a0a00] text-lg mb-6">You need to sign in to access your account.</p>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="mt-2 bg-[#281000] text-white px-6 py-3 rounded-full"
          >
            Sign In
          </button>
        </div>

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => {
            setLoginModalOpen(false);
            // Re-check user when modal closes in case sign-in succeeded
            setTimeout(() => refreshUser(), 200);
          }}
        />
      </div>
    );
  }

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'Customer';

  // ── HOME tab ─────────────────────────────────────────────────────────────
  if (tab === TABS.HOME) {
    return (
      <div className="bg-[#F7F4EF] min-h-screen">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-12 pb-24">

          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-semibold text-[#1a0a00]">My Account</h1>
              <p className="mt-2 text-sm text-[#1a0a00]/60">
                Signed in as <span className="font-semibold text-[#281000]">{displayName}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-[#281000] px-4 py-2 text-[12px] font-semibold text-[#281000] hover:bg-[#281000] hover:text-white transition-colors"
            >
              LOG OUT
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className="rounded-3xl border border-[#1a0a00]/10 bg-white p-5">
              <p className="text-[13px] uppercase tracking-[0.3em] text-[#1a0a00]/50 mb-3">Contact</p>
              <p className="text-sm text-[#1a0a00]">{user?.email || 'No email available'}</p>
              {user?.phone && <p className="text-sm text-[#1a0a00] mt-2">{user.phone}</p>}
            </div>
            <div className="rounded-3xl border border-[#1a0a00]/10 bg-white p-5">
              <p className="text-[13px] uppercase tracking-[0.3em] text-[#1a0a00]/50 mb-3">Profile</p>
              <p className="text-sm text-[#1a0a00]">Provider: {user?.provider || 'email-otp'}</p>
              <p className="text-sm text-[#1a0a00] mt-2">Account type: Retail Customer</p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#1a0a00]/15" />

          {/* Order History row */}
          <div
            onClick={() => setTab(TABS.ORDERS)}
            className="flex items-center justify-between py-5 border-b border-[#1a0a00]/10 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[15px] font-medium text-[#1a0a00]">Order History</span>
            <span className="text-[11px] font-semibold tracking-widest text-[#1a0a00]/50 uppercase">
              {orders.length === 0 ? "YOU HAVEN'T PLACED ANY ORDERS YET" : `${orders.length} ORDER${orders.length > 1 ? 'S' : ''}`}
            </span>
          </div>

          {/* Account Details row */}
          <div
            onClick={() => setTab(TABS.ADDRESSES)}
            className="flex items-center justify-between py-5 border-b border-[#1a0a00]/10 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[15px] font-medium text-[#1a0a00]">Account Details</span>
            <span className="text-[13px] font-semibold text-[#1a0a00] underline underline-offset-2">
              View Addresses ({addresses.length}) →
            </span>
          </div>

        </div>
      </div>
    );
  }

  // ── ORDERS tab ────────────────────────────────────────────────────────────
  if (tab === TABS.ORDERS) {
    return (
      <div className="bg-[#F7F4EF] min-h-screen">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-12 pb-24">

          <div className="flex items-center justify-between mb-0">
            <h1 className="text-[17px] font-semibold text-[#1a0a00]">My Account</h1>
          </div>
          <div className="mt-4 border-t border-[#1a0a00]/15" />

          <button
            onClick={() => setTab(TABS.HOME)}
            className="mt-5 text-[11px] tracking-widest text-[#1a0a00]/60 hover:text-[#1a0a00] transition-colors flex items-center gap-1"
          >
            ← RETURN TO ACCOUNT DETAILS
          </button>

          <h2 className="mt-4 text-[15px] font-semibold text-[#1a0a00] mb-6">Order History</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-[12px] font-semibold tracking-widest text-[#1a0a00]/40 uppercase text-center py-10">
              YOU HAVEN&apos;T PLACED ANY ORDERS YET
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl border border-[#1a0a00]/8 overflow-hidden">
                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1a0a00]/6">
                    <div>
                      <p className="text-[11px] text-[#1a0a00]/40 mb-0.5 tracking-wide">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-[#1a0a00]/40">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#1a0a00]">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${ORDER_COLOURS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-3 divide-y divide-[#1a0a00]/5">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-3">
                        <div className="relative h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-2xl border border-[#E8DED8] bg-[#F7F4EF]">
                          <Image
                            src={item.image || '/retail/home/7.png'}
                            alt={item.name || 'Product'}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a0a00] truncate">{item.name}</p>
                          <p className="text-xs text-[#1a0a00]/40 mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm text-[#1a0a00] font-medium shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ADDRESSES list tab ───────────────────────────────────────────────────
  if (tab === TABS.ADDRESSES) {
    return (
      <div className="bg-[#F7F4EF] min-h-screen">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-12 pb-24">

          {/* Header */}
          <div className="flex items-center justify-between mb-0">
            <h1 className="text-[17px] font-semibold text-[#1a0a00]">My Account</h1>
            <button
              onClick={goToAddAddress}
              className="bg-[#1a0a00] text-white text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:bg-black transition-colors"
            >
              + ADD NEW ADDRESS
            </button>
          </div>

          <div className="mt-4 border-t border-[#1a0a00]/15" />

          <button
            onClick={() => setTab(TABS.HOME)}
            className="mt-5 text-[11px] tracking-widest text-[#1a0a00]/60 hover:text-[#1a0a00] transition-colors flex items-center gap-1"
          >
            ← RETURN TO ACCOUNT DETAILS
          </button>

          <h2 className="mt-4 text-[15px] font-semibold text-[#1a0a00] mb-6">Your Addresses</h2>

          {addrLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-[13px] text-[#1a0a00]/40 text-center py-10">No addresses saved yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {addresses.map((a) => (
                <div key={a._id} className="bg-white rounded-2xl border border-[#1a0a00]/8 overflow-hidden">
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-[#1a0a00] text-[15px]">{a.name || user.name}</p>
                      {a.isDefault && (
                        <span className="bg-[#1a0a00] text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#1a0a00]/60 leading-6">
                      {a.street}<br />
                      {[a.city, a.state].filter(Boolean).join(', ')}<br />
                      {a.pincode}<br />
                      {a.phone && <span>{a.phone}</span>}
                    </p>
                    {a.label && a.label !== 'Home' && (
                      <span className="mt-2 inline-block text-[10px] uppercase tracking-widest text-[#1a0a00]/40 border border-[#1a0a00]/15 px-2 py-0.5 rounded">
                        {a.label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 border-t border-[#1a0a00]/8 text-[12px] font-semibold tracking-widest">
                    <button
                      onClick={() => startEdit(a)}
                      className="py-3.5 text-[#1a0a00]/50 hover:bg-[#1a0a00]/5 hover:text-[#1a0a00] transition-colors"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => deleteAddress(a._id)}
                      className="py-3.5 border-l border-[#1a0a00]/8 text-[#1a0a00]/50 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ADD / EDIT ADDRESS tab ───────────────────────────────────────────────
  if (tab === TABS.ADD_ADDR || tab === TABS.EDIT_ADDR) {
    // Get user coords for map embed
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik&marker=51.477398%2C-0.001789`;

    return (
      <div className="bg-[#F7F4EF] min-h-screen">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 pt-12 pb-24">

          {/* Header */}
          <div className="flex items-center justify-between mb-0">
            <h1 className="text-[17px] font-semibold text-[#1a0a00]">My Account</h1>
            <button
              onClick={goToAddAddress}
              className="bg-[#1a0a00] text-white text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:bg-black transition-colors"
            >
              + ADD NEW ADDRESS
            </button>
          </div>

          <div className="mt-4 border-t border-[#1a0a00]/15" />

          <button
            onClick={() => { setTab(TABS.ADDRESSES); setEditAddr(null); setAddrForm(emptyAddr); setShowAddrForm(false); }}
            className="mt-5 text-[11px] tracking-widest text-[#1a0a00]/60 hover:text-[#1a0a00] transition-colors flex items-center gap-1"
          >
            ← RETURN TO ACCOUNT DETAILS
          </button>

          <h2 className="mt-4 text-[15px] font-semibold text-[#1a0a00] mb-6">Your Addresses</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form card */}
            <div className="bg-white rounded-2xl border border-[#1a0a00]/8 p-6">
              <h3 className="text-[15px] font-semibold text-[#1a0a00] mb-5">
                {editAddr ? 'Edit Address' : 'Add a New Address'}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* First Name / Last Name split from full name */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">First Name</label>
                  <input
                    value={addrForm.name.split(' ')[0] || ''}
                    onChange={(e) => {
                      const parts = addrForm.name.split(' ');
                      parts[0] = e.target.value;
                      setAddrForm({ ...addrForm, name: parts.join(' ').trim() });
                    }}
                    placeholder="Enter your first name"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Last Name</label>
                  <input
                    value={addrForm.name.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const first = addrForm.name.split(' ')[0] || '';
                      setAddrForm({ ...addrForm, name: [first, e.target.value].filter(Boolean).join(' ') });
                    }}
                    placeholder="Enter your last name"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Address 1</label>
                  <input
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    placeholder="Enter your house number, street name"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Address 2</label>
                  <input
                    value={addrForm.label === 'Home' ? '' : addrForm.label}
                    onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value || 'Home' })}
                    placeholder="Enter your area, nearby landmark"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Pin / Zip / Postal Code</label>
                  <input
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    placeholder="Enter your Pin / Zip / Postal Code"
                    inputMode="numeric"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">City</label>
                  <input
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    placeholder="Enter your city name"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Country</label>
                  <select
                    value={addrForm.state.includes('India') ? 'India' : ''}
                    onChange={(e) => {}}
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00]/50 appearance-none"
                  >
                    <option value="">Select Your Country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">State/Province</label>
                  <input
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    placeholder="Select Your State/Province"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                  <input
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}
                    placeholder="Enter your Mobile Number"
                    inputMode="numeric"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Alternative Mobile Number</label>
                  <input
                    placeholder="Enter your Alternative Mobile Number"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-[#1a0a00] rounded"
                />
                <span className="text-[13px] text-[#1a0a00]/60">Set as default address</span>
              </label>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={saveAddress}
                  disabled={addrSaving}
                  className="bg-[#1a0a00] text-white text-[12px] font-semibold tracking-widest px-10 py-3 rounded-full hover:bg-black transition-colors disabled:opacity-50"
                >
                  {addrSaving ? 'SAVING…' : '+ ADD NEW ADDRESS'}
                </button>
              </div>
            </div>

            {/* Map card */}
            <div className="bg-white rounded-2xl border border-[#1a0a00]/8 overflow-hidden flex flex-col">
              <button
                onClick={useCurrentLocation}
                className="m-4 bg-[#1a0a00] text-white text-[12px] font-semibold tracking-wide px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Use your Current Location
              </button>

              {mapError && (
                <p className="text-[11px] text-red-400 text-center px-4 -mt-2 mb-2">
                  {mapError === 'permission-denied'
                    ? 'Location permission denied. Please enable location access in your browser.'
                    : 'Could not get location. Please try again.'}
                </p>
              )}

              <div className="flex-1 min-h-[220px] mx-4 mb-4 rounded-xl overflow-hidden border border-[#1a0a00]/8">
                <iframe
                  title="map"
                  src={(() => {
                    const lat = addrForm.lat || 26.489;
                    const lon = addrForm.lon || 74.566;
                    const delta = 0.03;
                    const left = lon - delta;
                    const right = lon + delta;
                    const bottom = lat - delta;
                    const top = lat + delta;
                    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
                  })()}
                  className="w-full h-full min-h-[200px]"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>

              {addrForm.city && (
                <div className="px-4 pb-4">
                  <p className="text-[13px] font-semibold text-[#1a0a00]">{addrForm.city}</p>
                  <p className="text-[12px] text-[#1a0a00]/50">{[addrForm.street, addrForm.city, addrForm.state, addrForm.pincode].filter(Boolean).join(', ')}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F4EF] min-h-screen flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
