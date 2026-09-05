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
  const [cancelModal,   setCancelModal]   = useState(null); // { orderId, orderNum }
  const [cancelReason,  setCancelReason]  = useState('');
  const [cancelling,    setCancelling]    = useState(false);
  const [trackingData,  setTrackingData]  = useState({}); // { [orderId]: trackingInfo }
  const [trackingLoading, setTrackingLoading] = useState({}); // { [orderId]: bool }

  // Return / Exchange state
  const [returnModal,   setReturnModal]   = useState(null); // { order }
  const [returnType,    setReturnType]    = useState('return'); // 'return' | 'exchange'
  const [returnReason,  setReturnReason]  = useState('');
  const [returnDetail,  setReturnDetail]  = useState('');
  const [exchangeFor,   setExchangeFor]   = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnRequests, setReturnRequests] = useState({}); // { [orderId]: request }

  const RETURN_WINDOW_DAYS = 7;

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
      fetchReturnRequests();
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

  const openCancelModal = (order) => {
    setCancelModal({ orderId: order._id, orderNum: order._id.slice(-8).toUpperCase() });
    setCancelReason('');
  };

  const confirmCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      const res  = await fetch(`/api/retail/orders/${cancelModal.orderId}/cancel`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason || 'Cancelled by customer' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Cancel failed');
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => o._id === cancelModal.orderId ? { ...o, orderStatus: 'cancelled' } : o)
      );
      setCancelModal(null);
    } catch (err) {
      alert(err.message);
    } finally { setCancelling(false); }
  };

  const fetchTracking = async (orderId) => {
    setTrackingLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res  = await fetch(`/api/retail/orders/${orderId}/track`, { credentials: 'include' });
      const data = await res.json();
      setTrackingData((prev) => ({ ...prev, [orderId]: data }));
    } catch (err) {
      setTrackingData((prev) => ({ ...prev, [orderId]: { success: false, error: err.message } }));
    } finally {
      setTrackingLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Fetch all return requests once, map by orderId
  const fetchReturnRequests = async () => {
    try {
      const res  = await fetch('/api/retail/returns', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const map = {};
        (data.data || []).forEach((r) => {
          const oid = r.orderId?._id?.toString() || r.orderId?.toString();
          if (oid) map[oid] = r;
        });
        setReturnRequests(map);
      }
    } catch (_) {}
  };

  const openReturnModal = (order) => {
    setReturnModal({ order });
    setReturnType('return');
    setReturnReason('');
    setReturnDetail('');
    setExchangeFor('');
  };

  const submitReturnRequest = async () => {
    if (!returnModal || !returnReason) return;
    setSubmittingReturn(true);
    try {
      const res  = await fetch('/api/retail/returns', {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId:      returnModal.order._id,
          type:         returnType,
          items:        returnModal.order.items,
          reason:       returnReason,
          reasonDetail: returnDetail,
          exchangeFor:  exchangeFor,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Submission failed');
      // Cache result so button shows "Requested" state
      const oid = returnModal.order._id;
      setReturnRequests((prev) => ({ ...prev, [oid]: data.data }));
      setReturnModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReturn(false);
    }
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

    // Shiprocket status → our step index
    const TRACK_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const statusToStep = (orderStatus, srStatus) => {
      const s = (srStatus || orderStatus || '').toLowerCase();
      if (s.includes('deliver')) return 4;
      if (s.includes('out for delivery') || s.includes('out_for_delivery')) return 3;
      if (s.includes('ship') || s.includes('transit') || s.includes('picked')) return 2;
      if (s.includes('process') || s.includes('manifest')) return 1;
      return 0;
    };

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
              {orders.map((order) => {
                const canCancel = ['placed', 'processing'].includes(order.orderStatus);
                const canTrack  = order.trackingId && !['cancelled'].includes(order.orderStatus);

                // Return window: only delivered orders within 7 days
                const isDelivered = order.orderStatus === 'delivered';
                const daysSinceUpdate = (Date.now() - new Date(order.updatedAt || order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                const withinReturnWindow = daysSinceUpdate <= RETURN_WINDOW_DAYS;
                const existingReturn = returnRequests[order._id];
                const canReturn = isDelivered && withinReturnWindow && !existingReturn;
                const tData     = trackingData[order._id];
                const tLoading  = trackingLoading[order._id];
                const currentStep = tData?.tracked
                  ? statusToStep(order.orderStatus, tData.currentStatus)
                  : statusToStep(order.orderStatus);

                return (
                  <div key={order._id} className="bg-white rounded-2xl border border-[#1a0a00]/8 overflow-hidden shadow-sm">
                    {/* Order header */}
                    <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1a0a00]/6 bg-[#FCFAF7]">
                      <div>
                        <p className="text-[11px] font-mono text-[#95565E] font-semibold mb-0.5 tracking-wide">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-[#1a0a00]/40">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-[#1a0a00]">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${ORDER_COLOURS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                          {order.orderStatus}
                        </span>
                        {/* Track button */}
                        {canTrack && (
                          <button
                            onClick={() => {
                              toggleOrderExpand(order._id);
                              if (!tData) fetchTracking(order._id);
                            }}
                            className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            TRACK
                          </button>
                        )}
                        {/* Cancel button */}
                        {canCancel && (
                          <button
                            onClick={() => openCancelModal(order)}
                            className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            CANCEL
                          </button>
                        )}
                        {/* Return / Exchange button */}
                        {canReturn && (
                          <button
                            onClick={() => openReturnModal(order)}
                            className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            RETURN / EXCHANGE
                          </button>
                        )}
                        {/* Existing return badge */}
                        {existingReturn && (
                          <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border ${
                            existingReturn.status === 'pending'   ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            existingReturn.status === 'approved'  ? 'bg-green-50  border-green-200  text-green-700'  :
                            existingReturn.status === 'rejected'  ? 'bg-red-50    border-red-200    text-red-600'    :
                            existingReturn.status === 'refunded'  ? 'bg-blue-50   border-blue-200   text-blue-700'   :
                            'bg-gray-50 border-gray-200 text-gray-600'
                          }`}>
                            {existingReturn.type?.toUpperCase()} {existingReturn.status?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items list */}
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
                                    <span className="capitalize text-neutral-400 font-semibold">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                                    <strong className="text-[#1a0a00]/70 font-semibold">{val || 'N/A'}</strong>
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Expandable details + tracking */}
                    {expandedOrders[order._id] && (
                      <div className="px-5 py-5 bg-[#FAF8F5] border-t border-[#1a0a00]/5 space-y-5">

                        {/* Live Tracking stepper */}
                        {order.orderStatus !== 'cancelled' && (
                          <div className="bg-white rounded-2xl border border-[#1a0a00]/5 p-4">
                            <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-4">Order Progress</h4>

                            {/* Step progress bar */}
                            <div className="flex items-center gap-0 mb-4 overflow-x-auto pb-1">
                              {TRACK_STEPS.map((step, idx) => (
                                <div key={step} className="flex items-center flex-1 min-w-0">
                                  <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                                      idx <= currentStep
                                        ? 'bg-[#281000] border-[#281000] text-white'
                                        : 'bg-white border-gray-200 text-gray-300'
                                    }`}>
                                      {idx < currentStep ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : (
                                        <span className="text-[9px] font-bold">{idx + 1}</span>
                                      )}
                                    </div>
                                    <span className={`mt-1.5 text-[9px] font-semibold text-center leading-tight max-w-[56px] ${
                                      idx <= currentStep ? 'text-[#281000]' : 'text-gray-300'
                                    }`}>
                                      {step}
                                    </span>
                                  </div>
                                  {idx < TRACK_STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 -mt-5 transition-all ${
                                      idx < currentStep ? 'bg-[#281000]' : 'bg-gray-200'
                                    }`} />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Shiprocket live data */}
                            {canTrack && (
                              <>
                                {tLoading && (
                                  <div className="flex items-center gap-2 text-[11px] text-[#1a0a00]/50 py-2">
                                    <span className="w-3 h-3 border border-[#281000]/30 border-t-[#281000] rounded-full animate-spin" />
                                    Fetching live tracking…
                                  </div>
                                )}
                                {tData && !tLoading && (
                                  <>
                                    {tData.success && tData.tracked ? (
                                      <div className="space-y-2">
                                        <div className="flex flex-wrap gap-3 text-[11px] text-[#1a0a00]/60 mb-2">
                                          {tData.courierName && <span>Courier: <strong className="text-[#1a0a00]">{tData.courierName}</strong></span>}
                                          {tData.etd && <span>Est. Delivery: <strong className="text-[#1a0a00]">{tData.etd}</strong></span>}
                                          {tData.trackUrl && (
                                            <a href={tData.trackUrl} target="_blank" rel="noreferrer"
                                              className="text-indigo-600 underline font-semibold">
                                              Track on courier site →
                                            </a>
                                          )}
                                        </div>
                                        {tData.activities?.length > 0 && (
                                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                            {tData.activities.slice(0, 8).map((act, ai) => (
                                              <div key={ai} className="flex gap-3 text-[11px]">
                                                <span className="text-[#1a0a00]/30 whitespace-nowrap shrink-0">{act.date}</span>
                                                <span className="text-[#1a0a00]/70">{act.description || act.activity}</span>
                                                {act.location && <span className="text-[#1a0a00]/40 shrink-0">{act.location}</span>}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : tData.success && !tData.tracked ? (
                                      <p className="text-[11px] text-[#1a0a00]/40 italic">{tData.message}</p>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <p className="text-[11px] text-red-500">Could not fetch tracking. <button onClick={() => fetchTracking(order._id)} className="underline">Retry</button></p>
                                      </div>
                                    )}
                                  </>
                                )}
                                {!tData && !tLoading && (
                                  <button
                                    onClick={() => fetchTracking(order._id)}
                                    className="text-[11px] text-indigo-600 underline font-semibold"
                                  >
                                    Load live tracking details
                                  </button>
                                )}
                              </>
                            )}

                            {order.trackingId && (
                              <p className="mt-2 text-[11px] text-[#1a0a00]/50">
                                AWB: <span className="font-mono bg-gray-50 px-1.5 py-0.5 border border-gray-100 rounded select-all text-gray-700">{order.trackingId}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Cancelled reason */}
                        {order.orderStatus === 'cancelled' && order.cancelReason && (
                          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[12px] text-red-700">
                            <span className="font-semibold">Cancellation reason: </span>{order.cancelReason}
                          </div>
                        )}

                        {/* Return / Exchange request details */}
                        {existingReturn && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-[12px] space-y-1.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
                              {existingReturn.type === 'exchange' ? '🔄 Exchange Request' : '↩ Return Request'}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-700/70">Status:</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                existingReturn.status === 'pending'   ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                                existingReturn.status === 'approved'  ? 'bg-green-50  border-green-300  text-green-700'  :
                                existingReturn.status === 'rejected'  ? 'bg-red-50    border-red-300    text-red-600'    :
                                existingReturn.status === 'refunded'  ? 'bg-blue-50   border-blue-300   text-blue-700'   :
                                existingReturn.status === 'picked_up' ? 'bg-purple-50 border-purple-300 text-purple-700' :
                                'bg-gray-50 border-gray-200 text-gray-600'
                              }`}>
                                {existingReturn.status?.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p><span className="text-amber-700/70">Reason: </span><strong>{existingReturn.reason}</strong></p>
                            {existingReturn.reasonDetail && <p className="text-amber-700/70">{existingReturn.reasonDetail}</p>}
                            {existingReturn.exchangeFor && <p><span className="text-amber-700/70">Exchange for: </span><strong>{existingReturn.exchangeFor}</strong></p>}
                            {existingReturn.adminNote && (
                              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 text-amber-900">
                                <span className="font-semibold block text-[10px] uppercase tracking-wide mb-0.5">Response from Dada-Exports:</span>
                                {existingReturn.adminNote}
                              </div>
                            )}
                            {existingReturn.refundAmount && (
                              <p className="text-green-700 font-semibold">
                                Refund: ₹{existingReturn.refundAmount.toLocaleString('en-IN')}
                                {existingReturn.refundId && <span className="text-[10px] font-mono ml-2 text-gray-500">({existingReturn.refundId})</span>}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4 text-xs text-[#1a0a00]/80">
                          {/* Shipping */}
                          <div className="bg-white p-4 rounded-xl border border-[#1a0a00]/5 shadow-2xs">
                            <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-2.5">Shipping Address</h4>
                            <p className="font-semibold text-[#1a0a00] mb-1">{order.shippingAddress?.name}</p>
                            <p className="leading-5 text-[#1a0a00]/70">{order.shippingAddress?.street}</p>
                            <p className="leading-5 text-[#1a0a00]/70">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            {order.shippingAddress?.phone && <p className="mt-2 text-[11px] text-[#1a0a00]/60">Contact: {order.shippingAddress.phone}</p>}
                          </div>

                          {/* Payment */}
                          <div className="bg-white p-4 rounded-xl border border-[#1a0a00]/5 shadow-2xs">
                            <h4 className="font-bold uppercase tracking-wider text-[#1a0a00]/40 text-[10px] mb-2.5">Payment Details</h4>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[#1a0a00]/60">Status:</span>
                              <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[9px] uppercase border inline-block ${
                                order.paymentStatus === 'paid'   ? 'bg-green-50  text-green-700  border-green-200' :
                                order.paymentStatus === 'failed' ? 'bg-red-50    text-red-700    border-red-200' :
                                                                   'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {order.paymentStatus || 'pending'}
                              </span>
                            </div>
                            <p className="text-[#1a0a00]/60 mb-0.5">Gateway: <strong>Razorpay</strong></p>
                            {order.paymentId && (
                              <p className="text-[#1a0a00]/60">Payment ID: <span className="font-mono bg-gray-50 px-1 py-0.5 border border-gray-100 rounded select-all text-gray-800">{order.paymentId}</span></p>
                            )}
                          </div>
                        </div>

                        {order.adminNote && (
                          <div className="p-3 bg-[#FFFDFB] border border-amber-100 rounded-xl text-[11px] text-amber-800">
                            <span className="font-semibold block mb-0.5">Note from Dada-Exports:</span>
                            {order.adminNote}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expand/Collapse */}
                    <div className="border-t border-[#1a0a00]/5 text-center bg-[#FAF8F5]">
                      <button
                        onClick={() => {
                          toggleOrderExpand(order._id);
                          // Auto-load tracking when expanding if trackingId exists and not loaded yet
                          if (!expandedOrders[order._id] && canTrack && !tData) {
                            fetchTracking(order._id);
                          }
                        }}
                        className="w-full py-3 text-[11px] font-bold tracking-widest text-[#281000]/60 hover:text-[#281000] hover:bg-[#1a0a00]/5 transition-colors"
                      >
                        {expandedOrders[order._id] ? 'HIDE ORDER DETAILS ▲' : 'VIEW ORDER DETAILS ▼'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Cancel Confirmation Modal ── */}
        {cancelModal && (          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-[17px] font-bold text-[#1a0a00]">Cancel Order #{cancelModal.orderNum}?</h3>
              <p className="text-[13px] text-[#1a0a00]/60 leading-relaxed">
                This action cannot be undone. If payment was made, a refund will be initiated within 5–7 business days to your original payment method.
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-[#1a0a00]/50 uppercase tracking-wide mb-1.5">
                  Reason for cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3 text-[13px] text-[#1a0a00] bg-white outline-none focus:border-[#1a0a00] transition-colors"
                >
                  <option value="">Select a reason</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Wrong item or size ordered">Wrong item or size ordered</option>
                  <option value="Delivery time too long">Delivery time too long</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCancelModal(null)}
                  disabled={cancelling}
                  className="flex-1 py-3 rounded-full border border-[#1a0a00]/15 text-[13px] font-semibold text-[#1a0a00]/60 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelling || !cancelReason}
                  className="flex-1 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Cancelling…</>
                  ) : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Return / Exchange Modal ── */}
        {returnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div>
                <h3 className="text-[17px] font-bold text-[#1a0a00]">Return / Exchange Request</h3>
                <p className="text-[12px] text-[#1a0a00]/50 mt-1">
                  Order #{returnModal.order._id.slice(-8).toUpperCase()} · Within {RETURN_WINDOW_DAYS}-day return window
                </p>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2">
                {['return', 'exchange'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReturnType(t)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border transition-all ${
                      returnType === t
                        ? 'bg-[#281000] text-white border-[#281000]'
                        : 'bg-white text-[#1a0a00]/60 border-[#1a0a00]/15 hover:border-[#1a0a00]/40'
                    }`}
                  >
                    {t === 'return' ? '↩ Return & Refund' : '🔄 Exchange'}
                  </button>
                ))}
              </div>

              {/* Items being returned */}
              <div>
                <p className="text-[11px] font-semibold text-[#1a0a00]/50 uppercase tracking-wide mb-2">Items in this order</p>
                <div className="space-y-2">
                  {returnModal.order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#FAF8F5] rounded-xl p-3 border border-[#1a0a00]/5">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        <Image src={item.image || '/retail/home/7.png'} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#1a0a00] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#1a0a00]/40">{[item.size, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1a0a00]/50 uppercase tracking-wide mb-1.5">
                  Reason *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3 text-[13px] text-[#1a0a00] bg-white outline-none focus:border-[#1a0a00] transition-colors"
                >
                  <option value="">Select a reason</option>
                  <option value="Size doesn't fit">Size doesn&apos;t fit</option>
                  <option value="Wrong item received">Wrong item received</option>
                  <option value="Product damaged or defective">Product damaged or defective</option>
                  <option value="Not as described">Not as described</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Quality not as expected">Quality not as expected</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Additional detail */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1a0a00]/50 uppercase tracking-wide mb-1.5">
                  Additional details <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={returnDetail}
                  onChange={(e) => setReturnDetail(e.target.value)}
                  placeholder="Describe the issue in more detail..."
                  className="w-full border border-[#1a0a00]/15 rounded-xl px-3 py-2.5 text-[13px] text-[#1a0a00] bg-white outline-none focus:border-[#1a0a00] transition-colors resize-none"
                />
              </div>

              {/* Exchange for (only if exchange type) */}
              {returnType === 'exchange' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#1a0a00]/50 uppercase tracking-wide mb-1.5">
                    Exchange for (size / variant)
                  </label>
                  <input
                    type="text"
                    value={exchangeFor}
                    onChange={(e) => setExchangeFor(e.target.value)}
                    placeholder="e.g. Size L, Blue color"
                    className="w-full h-10 border border-[#1a0a00]/15 rounded-xl px-3 text-[13px] text-[#1a0a00] bg-white outline-none focus:border-[#1a0a00] transition-colors"
                  />
                </div>
              )}

              {/* Policy note */}
              <div className="bg-[#FAF8F5] rounded-xl p-3 text-[11px] text-[#1a0a00]/60 leading-relaxed border border-[#1a0a00]/5">
                {returnType === 'return'
                  ? '↩ Refund will be processed within 5–7 business days after we receive the item. Original payment method will be credited.'
                  : '🔄 Our team will review your exchange request and contact you within 2–3 business days with pickup & delivery details.'}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setReturnModal(null)}
                  disabled={submittingReturn}
                  className="flex-1 py-3 rounded-full border border-[#1a0a00]/15 text-[13px] font-semibold text-[#1a0a00]/60 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReturnRequest}
                  disabled={submittingReturn || !returnReason}
                  className="flex-1 py-3 rounded-full bg-[#281000] hover:bg-black text-white text-[13px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingReturn ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting…</>
                  ) : `Submit ${returnType === 'exchange' ? 'Exchange' : 'Return'} Request`}
                </button>
              </div>
            </div>
          </div>
        )}
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
