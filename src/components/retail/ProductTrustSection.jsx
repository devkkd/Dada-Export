'use client';

import { useState } from 'react';

export default function ProductTrustSection({ product }) {
  const [pincode, setPincode] = useState('');
  const [checkedPincode, setCheckedPincode] = useState(null);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate dynamic estimated delivery dates (3-5 business days from today)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5);

  const formatDate = (d) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMsg('Please enter a valid 6-digit Indian pincode.');
      setCheckedPincode(null);
      return;
    }
    setErrorMsg('');
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setCheckedPincode(cleanPin);
    }, 400);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Iveara Team! I am looking at "${product?.name || 'this product'}" and need help with sizing, fabric, and delivery details.`
  );

  return (
    <div className="space-y-6">

      {/* ── CARD 1: DELIVERY & PINCODE ESTIMATOR ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DED8] shadow-sm hover:shadow-md transition-shadow">
        
        {/* Header */}
        {/* <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#F2E5DB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#281000]/5 flex items-center justify-center text-[#281000] shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h5m-9 9h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#281000] tracking-tight">
                Delivery & Shipping Details
              </h3>
              <p className="text-xs text-[#7C6C63] font-medium">
                Check delivery speed & COD availability
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Express Dispatch
          </span>
        </div> */}

        {/* Pincode Check Form */}
        {/* <form onSubmit={handleCheckPincode} className="mt-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter 6-digit Pincode"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFBF8] text-sm text-[#281000] placeholder-neutral-400 font-medium rounded-xl border border-[#E8DED8] focus:border-[#281000] focus:ring-1 focus:ring-[#281000] outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={checking}
              className="px-5 py-2.5 rounded-xl bg-[#281000] hover:bg-[#1a0a00] text-white text-xs sm:text-sm font-semibold tracking-wider transition-all disabled:opacity-50 shrink-0 shadow-sm"
            >
              {checking ? 'Checking...' : 'Check'}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
              <span>⚠</span> {errorMsg}
            </p>
          )}

          
          {checkedPincode && !errorMsg && (
            <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-emerald-900">
                    Delivery Available to {checkedPincode}
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    Estimated Arrival: <strong className="font-bold underline decoration-emerald-500">{formatDate(deliveryStart)} – {formatDate(deliveryEnd)}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1.5 text-[11px] font-semibold text-emerald-900">
                    <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                      🚚 Free Shipping Eligible
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                      💵 Cash on Delivery (COD) Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form> */}

        {/* 4 Shipping Highlights Icons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4  ">
          
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFFBF8] border border-[#F2E5DB]/70 hover:border-[#E8DED8] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#281000]/5 flex items-center justify-center text-[#281000] shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#281000] leading-tight">Free Shipping</p>
              <p className="text-[11px] text-[#7C6C63] font-medium mt-0.5">Enjoy Hassle-Free Delivery Across India</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFFBF8] border border-[#F2E5DB]/70 hover:border-[#E8DED8] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#281000]/5 flex items-center justify-center text-[#281000] shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#281000] leading-tight">24–48h Dispatch</p>
              <p className="text-[11px] text-[#7C6C63] font-medium mt-0.5">Dispatched promptly from Pushkar</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFFBF8] border border-[#F2E5DB]/70 hover:border-[#E8DED8] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#281000]/5 flex items-center justify-center text-[#281000] shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#281000] leading-tight">7 Days Exchange</p>
              <p className="text-[11px] text-[#7C6C63] font-medium mt-0.5">Hassle-free doorstep size swap</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FFFBF8] border border-[#F2E5DB]/70 hover:border-[#E8DED8] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#281000]/5 flex items-center justify-center text-[#281000] shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#281000] leading-tight">Export Packaging</p>
              <p className="text-[11px] text-[#7C6C63] font-medium mt-0.5">Tamper-safe with garment bag</p>
            </div>
          </div>

        </div>

      </div>


     
      {/* <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DED8] shadow-sm hover:shadow-md transition-shadow">
        
        <div className="flex items-center gap-3 pb-4 border-b border-[#F2E5DB]">
          <div className="w-10 h-10 rounded-2xl bg-[#95565E]/10 flex items-center justify-center text-[#95565E] shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#281000] tracking-tight">
              Craftsmanship & Trust Guarantee
            </h3>
            <p className="text-xs text-[#7C6C63] font-medium">
              38+ Years of Family Textile Heritage in Pushkar · Est. 1992
            </p>
          </div>
        </div>

       
        <div className="space-y-3.5 mt-5">

    
          <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FFFBF8] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#281000] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
              1
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#281000]">
                100% Pure & Skin-Friendly Fabrics
              </p>
              <p className="text-xs text-[#5C4D44] font-medium leading-relaxed mt-0.5">
                Every meter of fabric is laboratory-tested for zero color bleeding, anti-pilling, and breathable all-day comfort.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FFFBF8] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#95565E] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
              2
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#281000]">
                Master Artisan Tailoring & Double Stitching
              </p>
              <p className="text-xs text-[#5C4D44] font-medium leading-relaxed mt-0.5">
                Tailored with export-grade precision, overlocked seams, and reinforced stress points for years of lasting wear.
              </p>
            </div>
          </div>

         
          <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FFFBF8] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#281000] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
              3
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#281000]">
                Direct From Manufacturer (No Middlemen)
              </p>
              <p className="text-xs text-[#5C4D44] font-medium leading-relaxed mt-0.5">
                Crafted directly at Dada Exports facility in Pushkar, delivering premium boutique quality without high retail markups.
              </p>
            </div>
          </div>

    
          <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#FFFBF8] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#95565E] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
              4
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#281000]">
                100% Secure Checkout & Buyer Protection
              </p>
              <p className="text-xs text-[#5C4D44] font-medium leading-relaxed mt-0.5">
                Bank-grade 256-bit encrypted payments. Pay securely via UPI, Cards, Net Banking or Cash on Delivery.
              </p>
            </div>
          </div>

        </div>

    
        <div className="mt-5 pt-4 border-t border-[#F2E5DB] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            Safe & Encrypted
          </span>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#281000]">
            <span className="px-2 py-0.5 bg-[#FFFBF8] rounded-md border border-[#E8DED8]">UPI</span>
            <span className="px-2 py-0.5 bg-[#FFFBF8] rounded-md border border-[#E8DED8]">Cards</span>
            <span className="px-2 py-0.5 bg-[#FFFBF8] rounded-md border border-[#E8DED8]">NetBanking</span>
            <span className="px-2 py-0.5 bg-[#FFFBF8] rounded-md border border-[#E8DED8]">COD</span>
          </div>
        </div>

      </div> */}


      {/* ── CARD 3: NEED SIZING OR STYLING HELP? (WHATSAPP ASSISTANCE) ── */}
      <div className="bg-gradient-to-br from-[#FFFBF8] to-[#F5ECE5] rounded-3xl p-6 sm:p-7 border border-[#E8DED8] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#95565E]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Styling & Fit Concierge
            </span>
            <h4 className="text-base font-bold text-[#281000]">
              Need Help Choosing Size or Fit?
            </h4>
            <p className="text-xs text-[#5C4D44] font-medium leading-relaxed">
              Our Pushkar stylists are live on WhatsApp to help you pick the right size, custom measurements, or matching pairings.
            </p>
          </div>

          <a
            href={`https://wa.me/918209934610?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all shrink-0 whitespace-nowrap"
          >
            {/* WhatsApp Icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
        <p className="text-[11px] text-[#7C6C63] mt-3 font-medium">
          Available Monday to Saturday, 10:00 AM – 7:00 PM IST · Direct human support
        </p>
      </div>

    </div>
  );
}
