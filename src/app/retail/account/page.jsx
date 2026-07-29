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
  street: '', city: '', state: '', pincode: '', country: '',
  lat: null, lon: null,
  isDefault: false,
};

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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

  // Load addresses and orders on login, and refresh when tab changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
      fetchOrders();
    }
  }, [isLoggedIn, tab]); // eslint-disable-line

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
      country:   addr.country   || '',
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
          // Attempt client-side reverse geocoding first (more reliable on user's browser residential IP)
          let json = null;
          try {
            const clientRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}&accept-language=en`);
            if (clientRes.ok) {
              json = await clientRes.json();
            }
          } catch (clientErr) {
            console.warn('Client-side Nominatim reverse geocode failed, falling back to server:', clientErr);
          }

          // Fallback to server reverse geocoding API if client fetch fails
          if (!json || !json.address) {
            const serverRes = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lng}`);
            if (serverRes.ok) {
              const serverJson = await serverRes.json();
              if (serverJson.success) {
                json = serverJson.data;
              }
            }
          }

          if (!json || !json.address) {
            // fallback: still set coords so map recenters, but mark mapError
            setAddrForm(prev => ({ ...prev, lat, lon: lng }));
            setMapError('failed');
            return;
          }

          const a = json.address || {};
          
          // Fallbacks for streets in India / rural areas where road may be missing
          const streetParts = [
            a.house_number,
            a.road,
            a.neighbourhood,
            a.suburb,
            a.city_district
          ].filter(Boolean);

          const constructedStreet = streetParts.length > 0 
            ? streetParts.join(', ') 
            : (a.subdistrict || a.county || '');

          setAddrForm(prev => ({
            ...prev,
            street:  constructedStreet,
            city:    a.city || a.town || a.village || a.county || '',
            state:   a.state || a.state_district || '',
            pincode: a.postcode || '',
            country: a.country || '',
            lat,
            lon: lng,
          }));
        } catch (err) {
          console.error('Reverse geocode error:', err);
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
                <div key={order._id} className="bg-white rounded-2xl border border-[#1a0a00]/8 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1a0a00]/6 bg-[#FCFAF7]">
                    <div>
                      <p className="text-[11px] font-mono text-[#95565E] font-semibold mb-0.5 tracking-wide">
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
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${ORDER_COLOURS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  
                  {/* Items list always shown in order card */}
                  <div className="px-5 py-3 divide-y divide-[#1a0a00]/5">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex flex-col py-3">
                        <div className="flex items-center gap-3">
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
                            <p className="text-sm font-medium text-[#1a0a00] flex items-center gap-1.5 flex-wrap">
                              <span>{item.name}</span>
                              {item.isCustomized && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Customized
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[#1a0a00]/40 mt-0.5">
                              {[item.size, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm text-[#1a0a00] font-medium shrink-0">
                            ₹{((item.price + (item.customizationPrice || 0)) * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>

                        {item.isCustomized && item.customizationFields && (
                          <div className="mt-2 ml-[92px] text-[11px] bg-[#FCFAF7] rounded-xl p-3 border border-[#1a0a00]/5 text-[#1a0a00]/70 space-y-1">
                            <span className="font-bold text-[9px] uppercase tracking-wider text-amber-800 block mb-0.5">Your Custom Sizing:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-0.5">
                              {Object.entries(
                                typeof item.customizationFields.toJSON === 'function' ? item.customizationFields.toJSON() :
                                (item.customizationFields instanceof Map ? Object.fromEntries(item.customizationFields) : item.customizationFields)
                              ).map(([key, val]) => (
                                <p key={key} className="truncate">
                                  <span className="capitalize text-neutral-400 font-semibold">{key.replace(/([A-Z])/g, ' $1')}:</span> <strong className="text-[#1a0a00]/70 font-semibold">{val || 'N/A'}</strong>
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Expandable Order Details Section */}
                  {expandedOrders[order._id] && (
                    <div className="px-5 py-5 bg-[#FAF8F5] border-t border-[#1a0a00]/5 text-xs text-[#1a0a00]/80 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div className="bg-white p-4 rounded-xl border border-[#1a0a00]/5 shadow-2xs">
                          <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-2.5">Shipping Address</h4>
                          <p className="font-semibold text-[#1a0a00] mb-1">{order.shippingAddress?.name || 'Recipients Name'}</p>
                          <p className="leading-5 text-[#1a0a00]/70">{order.shippingAddress?.street}</p>
                          <p className="leading-5 text-[#1a0a00]/70">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          {order.shippingAddress?.phone && <p className="mt-2 text-[11px] text-[#1a0a00]/60">Contact: {order.shippingAddress?.phone}</p>}
                        </div>

                        {/* Payment & Tracking Info */}
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-xl border border-[#1a0a00]/5 shadow-2xs">
                            <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-2.5">Payment Details</h4>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[#1a0a00]/60">Status:</span>
                              <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[9px] uppercase border inline-block ${
                                order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {order.paymentStatus || 'pending'}
                              </span>
                            </div>
                            <p className="text-[#1a0a00]/60 mb-0.5">Gateway: <strong>Razorpay</strong></p>
                            {order.paymentId && (
                              <p className="text-[#1a0a00]/60">
                                Payment ID: <span className="font-mono bg-gray-50 px-1 py-0.5 border border-gray-100 rounded select-all text-gray-800">{order.paymentId}</span>
                              </p>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-[#1a0a00]/5 shadow-2xs">
                            <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-2">Fulfillment & Tracking</h4>
                            {order.trackingId ? (
                              <p className="leading-5">
                                <span className="text-[#1a0a00]/60">AWB Tracking ID: </span>
                                <span className="font-mono font-semibold bg-gray-50 px-1.5 py-0.5 border border-gray-100 rounded select-all text-gray-800">{order.trackingId}</span>
                              </p>
                            ) : (
                              <p className="text-[#1a0a00]/50 italic leading-5">Awaiting courier shipment / tracking ID allocation.</p>
                            )}
                            {order.adminNote && (
                              <div className="mt-2.5 p-2 bg-[#FFFDFB] border border-amber-100 rounded text-[11px] text-amber-800">
                                <span className="font-semibold block mb-0.5">Note from Dada-Exports:</span>
                                {order.adminNote}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expand / Collapse Button */}
                  <div className="border-t border-[#1a0a00]/5 text-center bg-[#FAF8F5]">
                    <button
                      onClick={() => toggleOrderExpand(order._id)}
                      className="w-full py-3 text-[11px] font-bold tracking-widest text-[#281000]/60 hover:text-[#281000] hover:bg-[#1a0a00]/5 transition-colors"
                    >
                      {expandedOrders[order._id] ? 'HIDE ORDER DETAILS ▲' : 'VIEW ORDER DETAILS ▼'}
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
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
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
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
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
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Address 2</label>
                  <input
                    value={addrForm.label === 'Home' ? '' : addrForm.label}
                    onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value || 'Home' })}
                    placeholder="Enter your area, nearby landmark"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
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
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">City</label>
                  <input
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    placeholder="Enter your city name"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Country</label>
                  <select
                    value={addrForm.country || ''}
                    onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })}
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
                  >
                    <option value="">Select Your Country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">State/Province</label>
                  <input
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    placeholder="Select Your State/Province"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
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
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 mb-1.5 uppercase tracking-wide">Alternative Mobile Number</label>
                  <input
                    placeholder="Enter your Alternative Mobile Number"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3.5 text-[13px] outline-none focus:border-[#1a0a00] transition-colors bg-white text-[#1a0a00] font-medium"
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
