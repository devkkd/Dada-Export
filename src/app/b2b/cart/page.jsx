'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BUSINESS_TYPES = [
  'Boutique', 'Retail Chain', 'E-commerce', 'Wholesale Distributor',
  'International Importer / Exporter', 'Fashion Brand / Private Label',
  'Amazon / Meesho / Flipkart Seller', 'Stylist / Personal Shopper',
];

const COUNTRIES = [
  'India', 'USA', 'UAE', 'UK', 'Canada', 'Australia', 'Europe', 'Others',
];

const EMPTY_FORM = {
  fullName: '', designation: '', email: '', whatsapp: '',
  companyName: '', businessType: '', country: '', city: '',
  quantity: '', message: '',
};

export default function B2BCartPage() {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(null); // null | 'loading' | 'done'
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('b2b_cart') || '[]');
    setItems(cart);
  }, []);

  const saveCart = (updated) => {
    setItems(updated);
    localStorage.setItem('b2b_cart', JSON.stringify(updated));
  };

  const updateQty = (index, delta) => {
    const updated = [...items];
    const newQty  = Math.max(updated[index].moq || 1, (updated[index].quantity || 1) + delta);
    updated[index] = { ...updated[index], quantity: newQty };
    saveCart(updated);
  };

  const removeItem = (index) => saveCart(items.filter((_, i) => i !== index));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted('loading');
    try {
      const payload = {
        name:         form.fullName,
        designation:  form.designation,
        email:        form.email,
        phone:        form.whatsapp,
        company:      form.companyName,
        businessType: form.businessType,
        country:      form.country,
        city:         form.city,
        quantity:     form.quantity,
        message:      form.message,
        type:         'cart',
        products:     items.map((item) => ({
          productSlug: item.slug,
          name:        item.name,
          image:       item.image,
          size:        item.size,
          color:       item.color,
          quantity:    item.quantity || 1,
          moq:         item.moq,
        })),
      };

      const res  = await fetch('/api/b2b/inquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setSubmitted('done');
      localStorage.removeItem('b2b_cart');
      setItems([]);
      setForm(EMPTY_FORM);
    } catch (err) {
      alert('Error: ' + err.message);
      setSubmitted(null);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hello Dada Exports,\n\nI'd like to enquire about the following products:\n\n` +
    items.map((p, i) => `${i+1}. ${p.name} | Size: ${p.size} | Qty: ${p.quantity || 1}`).join('\n') +
    `\n\nPlease share MOQ and quotation.\n\n— ${form.fullName || 'Interested Buyer'}`
  );

  const inp = 'w-full px-5 py-3 rounded-2xl border border-[#D4C4B8] focus:border-[#95565E] outline-none text-sm bg-white text-[#0E0E0E] placeholder-[#A89899] transition-all';
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2395565E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', paddingRight: '2.5rem',
  };

  /* ── Empty cart ─────────────────────────────────────────── */
  if (submitted === 'done') {
    return (
      <div className="bg-[#FFFEF9] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#0E0E0E] mb-3">Enquiry Submitted!</h2>
          <p className="text-[#3C2F2F] mb-8">We'll respond within 24 business hours with pricing and availability.</p>
          <Link href="/b2b" className="px-8 py-3 bg-[#95565E] text-white rounded-full font-semibold hover:bg-[#7a3f47] transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFEF9] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-2">Enquiry Cart</h1>
        <p className="text-sm text-[#3C2F2F] mb-10">Review your selected products, then fill your details to submit a bulk enquiry.</p>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="text-black/70 text-lg mb-6">Your enquiry cart is empty.</p>
            <Link href="/b2b" className="px-8 py-3 bg-[#95565E] text-white rounded-full font-semibold hover:bg-[#7a3f47] transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* ── Cart Items ─────────────────────────────── */}
            <div className="space-y-4 mb-10">
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded-[24px] border border-[#E5D8CE] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image src={item.image || '/b2b/home/7.png'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black line-clamp-2">{item.name}</h3>
                    <div className="mt-2 space-y-1 text-[13px] text-black/60">
                      {item.size  && <p>Size: <span className="text-black">{item.size}</span></p>}
                      {item.color && <p>Color: <span className="text-black">{item.color}</span></p>}
                      {item.moq   && <p>Min Order: <span className="text-black">{item.moq} pcs</span></p>}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#CDBDB0] rounded-full h-10 overflow-hidden">
                        <button onClick={() => updateQty(index, -1)} className="w-10 h-10 flex items-center justify-center text-xl text-black hover:bg-gray-50">−</button>
                        <span className="px-4 text-sm font-medium text-black">{item.quantity || 1}</span>
                        <button onClick={() => updateQty(index, 1)} className="w-10 h-10 flex items-center justify-center text-xl text-black hover:bg-gray-50">+</button>
                      </div>
                      <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Proceed button ─────────────────────────── */}
            {!showForm && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowForm(true)}
                  className="px-10 py-4 bg-[#95565E] hover:bg-[#7a3f47] text-white rounded-full font-semibold text-base transition-all">
                  Proceed to Submit Enquiry →
                </button>
                <a href={`https://wa.me/919876543210?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 bg-[#25D366] hover:bg-[#20ba5c] text-white rounded-full font-semibold text-base flex items-center justify-center gap-3 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
                    <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.5.73 4.93 2.1 7L3.75 29l6.4-1.67a13.15 13.15 0 005.89 1.4c7.2 0 13.04-5.74 13.04-12.82C29.08 8.74 23.24 3 16.04 3zm7.58 18.1c-.32.89-1.88 1.7-2.6 1.81-.67.1-1.52.15-2.45-.15-.57-.18-1.31-.42-2.26-.83-3.97-1.72-6.56-5.73-6.76-6-.19-.27-1.61-2.11-1.61-4.02 0-1.91.99-2.84 1.34-3.23.35-.39.76-.49 1.02-.49.25 0 .51 0 .73.01.24.01.56-.09.87.65.32.77 1.08 2.66 1.18 2.86.1.2.16.43.03.7-.13.27-.19.43-.38.66-.19.23-.4.51-.57.69-.19.19-.39.4-.17.79.22.39.98 1.61 2.1 2.61 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.26.95-1.1 1.2-1.48.25-.38.51-.32.86-.19.35.13 2.24 1.05 2.62 1.24.38.19.63.29.73.45.09.16.09.95-.23 1.84z" />
                  </svg>
                  Enquiry on WhatsApp
                </a>
              </div>
            )}

            {/* ── Enquiry Form ────────────────────────────── */}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white rounded-[28px] border border-[#E5D8CE] p-6 sm:p-8 md:p-10 mt-2">
                <h2 className="text-xl font-semibold text-[#0E0E0E] mb-8">Your Details & Requirements</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Column 1 — Personal */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-[#95565E] uppercase tracking-wide">Your Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Full Name *</label>
                      <input required name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Designation / Role</label>
                      <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Owner, Buyer, Manager" className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Email Address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="business@yourcompany.com" className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">WhatsApp / Phone *</label>
                      <input required type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+91 or your country code" className={inp} />
                    </div>
                  </div>

                  {/* Column 2 — Business */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-[#95565E] uppercase tracking-wide">Your Business</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Company / Shop Name</label>
                      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Your business or store name" className={inp} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Business Type</label>
                      <select name="businessType" value={form.businessType} onChange={handleChange} className={`${inp} appearance-none cursor-pointer`} style={selectStyle}>
                        <option value="">Select Business Type</option>
                        {BUSINESS_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Country</label>
                      <select name="country" value={form.country} onChange={handleChange} className={`${inp} appearance-none cursor-pointer`} style={selectStyle}>
                        <option value="">Select Your Country</option>
                        {COUNTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">City / State</label>
                      <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai, Maharashtra" className={inp} />
                    </div>
                  </div>

                  {/* Column 3 — Order */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-[#95565E] uppercase tracking-wide">Order Requirements</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Estimated Quantity Required</label>
                      <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 50 pieces per style" className={inp} />
                    </div>

                    {/* Products summary in form */}
                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Selected Products ({items.length})</label>
                      <div className="bg-[#F9F4E1] rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
                        {items.map((item, i) => (
                          <div key={i} className="text-xs text-[#3C2F2F] flex justify-between">
                            <span className="line-clamp-1 flex-1">{item.name}</span>
                            <span className="ml-2 font-medium shrink-0">×{item.quantity || 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0E0E0E] mb-2">Your Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                        placeholder="Delivery timeline, target market, special requirements..."
                        className={`${inp} resize-none`} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-[#E5D8CE]">
                  <button type="submit" disabled={submitted === 'loading'}
                    className="px-10 py-4 bg-[#95565E] hover:bg-[#7a3f47] text-white rounded-full font-semibold text-base transition-all disabled:opacity-70 flex items-center gap-2">
                    {submitted === 'loading' && <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    {submitted === 'loading' ? 'Submitting…' : `Submit Enquiry for ${items.length} Product${items.length !== 1 ? 's' : ''}`}
                  </button>
                  <a href={`https://wa.me/919876543210?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
                    className="px-10 py-4 bg-[#25D366] hover:bg-[#20ba5c] text-white rounded-full font-semibold text-base flex items-center justify-center gap-3 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
                      <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.5.73 4.93 2.1 7L3.75 29l6.4-1.67a13.15 13.15 0 005.89 1.4c7.2 0 13.04-5.74 13.04-12.82C29.08 8.74 23.24 3 16.04 3zm7.58 18.1c-.32.89-1.88 1.7-2.6 1.81-.67.1-1.52.15-2.45-.15-.57-.18-1.31-.42-2.26-.83-3.97-1.72-6.56-5.73-6.76-6-.19-.27-1.61-2.11-1.61-4.02 0-1.91.99-2.84 1.34-3.23.35-.39.76-.49 1.02-.49.25 0 .51 0 .73.01.24.01.56-.09.87.65.32.77 1.08 2.66 1.18 2.86.1.2.16.43.03.7-.13.27-.19.43-.38.66-.19.23-.4.51-.57.69-.19.19-.39.4-.17.79.22.39.98 1.61 2.1 2.61 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.26.95-1.1 1.2-1.48.25-.38.51-.32.86-.19.35.13 2.24 1.05 2.62 1.24.38.19.63.29.73.45.09.16.09.95-.23 1.84z" />
                    </svg>
                    WhatsApp Enquiry
                  </a>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-4 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors">
                    ← Back to Cart
                  </button>
                </div>
                <p className="text-xs text-[#95565E] mt-4">We respond within 24 business hours.</p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
