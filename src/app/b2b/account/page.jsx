'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobile, setMobile] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [addresses, setAddresses] = useState([]);
  const router = useRouter();
  const [locationLoading, setLocationLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    mobile: '',
    altMobile: '',
  });

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    setAddresses(savedAddresses);
    const logged = localStorage.getItem('accountLogin');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (mobile === '9999999999') {
      setIsLoggedIn(true);
      localStorage.setItem('accountLogin', 'true');
    } else {
      alert('Invalid Number');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accountLogin');
    setIsLoggedIn(false);
    window.location.href = '/b2b';
  };

  const saveAddress = () => {
    const updated = [...addresses, { ...form, id: Date.now() }];
    setAddresses(updated);
    localStorage.setItem('addresses', JSON.stringify(updated));
    alert('Address Added Successfully');
    setActiveTab('addresses');
    setForm({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      mobile: '',
      altMobile: '',
    });
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((item) => item.id !== id);
    setAddresses(updated);
    localStorage.setItem('addresses', JSON.stringify(updated));
  };

  // ── Geolocation + Reverse Geocoding ──────────────────────────────────────
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};

          // Build a readable street address
          const street = [
            addr.house_number,
            addr.road || addr.pedestrian || addr.footway || '',
          ]
            .filter(Boolean)
            .join(', ');

          const suburb =
            addr.suburb ||
            addr.neighbourhood ||
            addr.quarter ||
            addr.village ||
            '';

          const city =
            addr.city ||
            addr.town ||
            addr.district ||
            addr.county ||
            '';

          const state = addr.state || '';
          const pincode = addr.postcode || '';
          const country = addr.country || 'India';

          setForm((prev) => ({
            ...prev,
            address1: street || suburb || '',
            address2: suburb && street ? suburb : '',
            city,
            state,
            country,
            pincode,
          }));
        } catch {
          alert('Could not fetch location details. Please try again.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) {
          alert('Location permission denied. Please allow location access.');
        } else {
          alert('Unable to retrieve your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const logged = localStorage.getItem('accountLogin');
    if (logged !== 'true') {
      router.replace('/b2b');
    }
  }, [router]);

  return (
    <div className="bg-[#FFFEF9] min-h-screen">
   <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        {/* ── Header ── */}
        <div className="flex justify-between items-center border-b border-[#95565E] pb-4 sm:pb-6">
          <h1 className="text-xl sm:text-2xl font-medium text-[#95565E]">
            My Account
          </h1>
          <button onClick={handleLogout} className="text-xs sm:text-sm text-[#0E0E0E]">
            LOG OUT →
          </button>
        </div>

        {/* ── ACCOUNT HOME ── */}
        {activeTab === 'account' && (
          <div className="mt-6 sm:mt-8 text-[#0E0E0E]">
            <div
              onClick={() => setActiveTab('orders')}
              className="py-4 border-b border-[#95565E] cursor-pointer text-black text-sm sm:text-base"
            >
              Order History
            </div>
            <div
              onClick={() => setActiveTab('addresses')}
              className="py-4 border-b border-[#95565E] cursor-pointer text-black text-sm sm:text-base"
            >
              Account Details
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div className="mt-8 sm:mt-10 text-black">
            <button onClick={() => setActiveTab('account')} className="text-xs sm:text-sm mb-4 sm:mb-6">
              ← RETURN TO ACCOUNT DETAILS
            </button>
            <h2 className="text-lg sm:text-xl text-[#95565E]">Order History</h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base">
              YOU HAVEN'T PLACED ANY ORDERS YET.
            </p>
          </div>
        )}

        {/* ── ADDRESS LIST ── */}
        {activeTab === 'addresses' && (
          <div className="mt-8 sm:mt-10 text-black">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
              <button onClick={() => setActiveTab('account')} className="text-xs sm:text-sm text-left">
                ← RETURN TO ACCOUNT DETAILS
              </button>
              <button
                onClick={() => setActiveTab('add-address')}
                className="bg-[#95565E] text-white px-5 py-2 rounded-full text-sm self-start sm:self-auto"
              >
                + ADD NEW ADDRESS
              </button>
            </div>

            <h2 className="mb-6 sm:mb-8 text-lg sm:text-xl">Your Addresses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {addresses.map((item) => (
                <div key={item.id} className="bg-[#FFFEF9] rounded-xl border overflow-hidden">
                  <div className="flex justify-between p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base">{item.firstName}</h3>
                    <span className="bg-[#95565E] text-white px-3 py-1 rounded-full text-xs">
                      Default
                    </span>
                  </div>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-xs sm:text-sm text-black">
                    <p>{item.address1}</p>
                    <p>{item.city}</p>
                    <p>{item.state}</p>
                    <p>{item.country}</p>
                    <p>{item.mobile}</p>
                  </div>
                  <div className="grid grid-cols-2 border-t text-sm">
                    <button className="py-3 border-r">EDIT</button>
                    <button onClick={() => deleteAddress(item.id)} className="py-3">
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADD ADDRESS ── */}
        {activeTab === 'add-address' && (
          <div className="mt-8 sm:mt-10 text-black">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
              <button onClick={() => setActiveTab('addresses')} className="text-xs sm:text-sm text-left">
                ← RETURN TO ACCOUNT DETAILS
              </button>
              <button className="bg-[#95565E] text-white px-5 py-2 rounded-full text-sm self-start sm:self-auto">
                + ADD NEW ADDRESS
              </button>
            </div>

            <h2 className="text-lg sm:text-xl mb-6 sm:mb-8">Your Addresses</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* ── FORM ── */}
              <div className="bg-white border rounded-2xl p-4 sm:p-6">
                <h3 className="mb-4 sm:mb-6 font-semibold text-sm sm:text-base">Add a New Address</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.keys(form).map((key) => (
                    <input
                      key={key}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
                      className="h-11 sm:h-12 border border-[#D8C8BC] rounded-lg px-3 sm:px-4 text-sm text-black placeholder:text-[#95565E]/30 placeholder:font-medium outline-none focus:border-[#281000]"
                    />
                  ))}
                </div>

                <button
                  onClick={saveAddress}
                  className="mt-6 sm:mt-8 bg-[#95565E] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm"
                >
                  + ADD NEW ADDRESS
                </button>
              </div>

              {/* ── MAP ── */}
              <div className="bg-white border rounded-2xl p-4 sm:p-6">
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className="w-full bg-[#95565E] text-white h-11 sm:h-12 rounded-full mb-4 sm:mb-6 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Fetching Location…
                    </>
                  ) : (
                    'Use your Current Location'
                  )}
                </button>

                <iframe
                  src="https://maps.google.com/maps?q=Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[250px] sm:h-[300px] lg:h-[350px] rounded-xl"
                />

                <div className="mt-3 sm:mt-4">
                  <h4 className="font-semibold text-sm sm:text-base">Jaipur, Rajasthan</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Rajasthan, India</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}