'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import CheckoutDrawer from '@/components/retail/CheckoutDrawer';
import { useRetailAuth } from '@/context/RetailAuthContext';

export default function RetailProductClient({ product, similar = [] }) {
  const images = product.images?.length
    ? product.images
    : [
      '/retail/newArrivals/1.png',
      '/retail/newArrivals/2.png',
      '/retail/newArrivals/3.png',
      '/retail/newArrivals/4.png',
    ];

  const prints = product.prints?.length ? product.prints : [];
  const sizes = product.variants?.map((v) => v.size) || ['Small', 'Medium', 'Large'];
  const colors = product.colors?.length
    ? product.colors
    : [
      { name: 'Olive Green', hex: '#6B7B4F' },
      { name: 'Blue', hex: '#1E40AF' },
      { name: 'Red', hex: '#DC2626' },
      { name: 'Purple', hex: '#6B21A8' },
    ];

  const fabrics = ['Cotton', 'Rayon', 'Banarasi Brocade', 'Keshia Silk', 'Denim', 'Georgette'];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedPrint, setSelectedPrint] = useState(prints[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedFabricCustom, setSelectedFabricCustom] = useState('Rayon');

  // Personal details
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custPincode, setCustPincode] = useState('');
  const [custOccasion, setCustOccasion] = useState('');

  // Unit toggles (each measurement can have 'IN' or 'CM')
  const [units, setUnits] = useState({
    height: 'CM',
    bust: 'IN',
    waist: 'IN',
    belly: 'IN',
    hip: 'IN',
    shoulder: 'IN',
    chest: 'IN',
    topLength: 'IN',
    skirtLength: 'IN',
    inseam: 'IN',
    backLength: 'IN',
  });

  // Measurement values
  const [measurements, setMeasurements] = useState({
    height: '',
    bust: '',
    waist: '',
    belly: '',
    hip: '',
    shoulder: '',
    chest: '',
    topLength: '',
    skirtLength: '',
    inseam: '',
    backLength: '',
  });

  // Preferred Fit states
  const [fitTop, setFitTop] = useState('Fitted');
  const [fitBottom, setFitBottom] = useState('Fitted');
  const [waistPreference, setWaistPreference] = useState('Elasticated (stretch)');
  const [necklinePreference, setNecklinePreference] = useState('Standard');
  const [backPreference, setBackPreference] = useState('Open Back');

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const { isLoggedIn } = useRetailAuth();
  const formattedPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '₹0.00';
  const formattedMRP = product.mrp ? `₹${product.mrp.toLocaleString('en-IN')}` : null;

  // Highlights pair logic
  const defaultHighlights = [
    { label: 'Color', value: 'Olive Green' },
    { label: 'Occasion', value: 'Casual' },
    { label: 'Fabric', value: 'Rayon' },
    { label: 'Sleeve Length', value: 'Sleeveless' },
    { label: 'Fit/Shape', value: 'Fit and Flare' },
    { label: 'Sleeve Styling', value: 'Shoulder Strap' },
    { label: 'Length', value: 'Maxi' },
    { label: 'Pattern', value: 'Printed' },
    { label: 'Neck', value: 'Shoulder Straps' },
    { label: 'Print or Pattern Type', value: 'Floral' },
  ];
  const highlightsToUse = product.highlights?.length ? product.highlights : defaultHighlights;
  const hlRows = [];
  for (let i = 0; i < highlightsToUse.length; i += 2) {
    hlRows.push([
      highlightsToUse[i]?.label || '',
      highlightsToUse[i]?.value || '',
      highlightsToUse[i + 1]?.label || '',
      highlightsToUse[i + 1]?.value || '',
    ]);
  }

  // Double layout image stack logic: ensure 4 images
  const displayImages = [...images];
  while (displayImages.length < 4) {
    displayImages.push(displayImages[0] || '/retail/newArrivals/1.png');
  }

  const fabricSwatches = [
    { name: 'Cotton', img: '/retail/newArrivals/7.png' },
    { name: 'Rayon', img: '/retail/newArrivals/8.png' },
    { name: 'Banarasi Brocade', img: '/retail/newArrivals/9.png' },
    { name: 'Keshia Silk', img: '/retail/newArrivals/10.png' },
    { name: 'Denim', img: '/retail/newArrivals/11.png' },
    { name: 'Georgette', img: '/retail/newArrivals/12.png' },
  ];

  const handleAddToCart = async () => {
    const item = {
      id: product._id,
      productId: product._id,
      name: product.name,
      image: images[activeImage] || images[0],
      price: product.price,
      size: selectedSize,
      print: selectedPrint || selectedFabricCustom,
      color: selectedColor,
      quantity,
    };

    if (isLoggedIn) {
      try {
        const res = await fetch('/api/retail/cart', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not add to cart');
        setToastMessage('Product added to cart');
        window.setTimeout(() => setToastMessage(''), 2500);
      } catch (err) {
        console.error(err);
        setToastMessage('Could not add to cart. Please try again.');
        window.setTimeout(() => setToastMessage(''), 2500);
      }
    } else {
      setToastMessage('Please login to add to cart');
      window.setTimeout(() => setToastMessage(''), 2500);
    }
  };

  const handleCustomOrderSubmit = async (e) => {
    e.preventDefault();
    if (!custName || !custPhone || !custEmail) {
      setSubmitError('Please fill in your Name, Phone, and Email to place a customized order.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const formattedMessage = `
--- CUSTOMIZATION ORDER REQUEST ---
Product Name: ${product.name}
Product URL: ${typeof window !== 'undefined' ? window.location.href : '/retail/product/' + product.slug}
Base Price: ${formattedPrice}
Customization Fee: ₹149.00
Total Amount: ₹${(product.price + 149).toLocaleString('en-IN')}

[Selected Standard Attributes]
Size Selected: ${selectedSize}
Color Selected: ${selectedColor}
Custom Fabric Selected: ${selectedFabricCustom}

[Body Measurements]
- Height: ${measurements.height || 'N/A'} ${units.height}
- Bust / Breast Size: ${measurements.bust || 'N/A'} ${units.bust}
- Waist: ${measurements.waist || 'N/A'} ${units.waist}
- Belly / Tummy Size: ${measurements.belly || 'N/A'} ${units.belly}
- Hip Size: ${measurements.hip || 'N/A'} ${units.hip}

[Length Measurements]
- Shoulder Width: ${measurements.shoulder || 'N/A'} ${units.shoulder}
- Chest Width (Front): ${measurements.chest || 'N/A'} ${units.chest}
- Top Length / Blouse Length: ${measurements.topLength || 'N/A'} ${units.topLength}
- Skirt / Dress Length: ${measurements.skirtLength || 'N/A'} ${units.skirtLength}
- Inseam / Trouser Length: ${measurements.inseam || 'N/A'} ${units.inseam}
- Back Length: ${measurements.backLength || 'N/A'} ${units.backLength}

[Preferred Fit & Styles]
- Fit Preference (Top): ${fitTop}
- Fit Preference (Bottom): ${fitBottom}
- Waistband Preference: ${waistPreference}
- Neckline Depth: ${necklinePreference}
- Back Style Preference: ${backPreference}

[Personal Details & Delivery]
- Customer Name: ${custName}
- WhatsApp / Phone: ${custPhone}
- Email Address: ${custEmail}
- Delivery Location: ${custCity || 'N/A'}
- Pincode: ${custPincode || 'N/A'}
- Occasion / Purpose: ${custOccasion || 'N/A'}
    `.trim();

    try {
      const res = await fetch('/api/customer-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: custName,
          email: custEmail.toLowerCase(),
          phone: custPhone,
          city: custCity,
          message: formattedMessage,
          source: 'retail',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit customization inquiry.');

      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMeasurementInput = (name, label, placeholder) => {
    const unit = units[name];
    const value = measurements[name];
    return (
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">{label}</label>
        <div className="relative flex items-center bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl overflow-hidden focus-within:border-[#281000] focus-within:ring-1 focus-within:ring-[#281000] transition">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setMeasurements({ ...measurements, [name]: e.target.value })}
            className="w-full px-4 py-3.5 text-sm bg-transparent outline-none pr-20 text-[#281000] placeholder-[#281000]/40 font-medium"
          />
          <div className="absolute right-2 flex items-center bg-[#F4EBE3] rounded-xl p-0.5 border border-[#C8BDB2]/30">
            <button
              type="button"
              onClick={() => setUnits({ ...units, [name]: 'IN' })}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${unit === 'IN'
                  ? 'bg-[#281000] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              IN
            </button>
            <button
              type="button"
              onClick={() => setUnits({ ...units, [name]: 'CM' })}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${unit === 'CM'
                  ? 'bg-[#281000] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
                }`}
            >
              CM
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFitSelector = (label, value, setValue, options) => {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">{label}</label>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => setValue(opt)}
              className={`px-4 py-2 text-xs rounded-xl border transition-all duration-300 ${value === opt
                  ? 'bg-[#281000] text-white border-[#281000] font-semibold'
                  : 'bg-transparent text-neutral-700 border-neutral-200 hover:border-[#281000] hover:text-black hover:bg-neutral-50'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 bg-[#FFF7F2]">
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#281000] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transition-all animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* LEFT: IMAGE GALLERY — same layout as B2B page */}
          <div className="col-span-1 lg:col-span-6 space-y-4">

            {/* Main Image */}
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl bg-white border border-[#E8DED8]">
              <Image
                src={displayImages[activeImage]}
                alt={`${product.name} - View ${activeImage + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>

            {/* Thumbnail Grid — 4 columns */}
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? 'border-[#281000] shadow-md scale-[1.03]'
                      : 'border-stone-200 opacity-80 hover:opacity-100 hover:border-[#281000]'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="col-span-1 lg:col-span-6 space-y-8">
            <div className="pb-2">
              <h1
                className="text-[28px] lg:text-[34px] font-medium text-[#281000] leading-tight"
                style={{ fontFamily: 'Mona Sans, sans-serif' }}
              >
                {product.name}
              </h1>
              {product.breadcrumbLabel && (
                <p className="text-base text-neutral-600 font-medium italic mt-2">
                  {product.breadcrumbLabel}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <p className="text-3xl font-extrabold text-[#281000] tracking-tight">
                  {formattedPrice}
                </p>
                {formattedMRP && product.mrp > product.price && (
                  <p className="text-lg text-neutral-400 line-through font-semibold">
                    {formattedMRP}
                  </p>
                )}
                <span className="px-4 py-1.5 rounded-full bg-green-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  Available
                </span>
                <p className="text-sm text-neutral-600 font-semibold">
                  Free Delivery on Orders Above ₹999 or more
                </p>
              </div>
            </div>

            {/* Size options */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <p className="text-neutral-700 font-bold text-sm uppercase tracking-wider">Size</p>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 ${selectedSize === size
                          ? 'bg-[#281000] text-white border-[#281000] shadow-md scale-105'
                          : 'bg-transparent text-neutral-800 border-[#C8BDB2] hover:border-[#281000]'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color options */}
            <div className="space-y-3">
              <p className="text-neutral-700 font-bold text-sm uppercase tracking-wider">Colors</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-300 ${selectedColor === color.name
                        ? 'bg-[#281000] text-white border-[#281000] shadow-md scale-105'
                        : 'bg-transparent text-neutral-800 border-[#C8BDB2] hover:border-[#281000]'
                      }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-inner shrink-0"
                      style={{ backgroundColor: color.hex || '#6B7B4F' }}
                    />
                    <span className="text-sm font-semibold">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric options */}
            <div className="space-y-3">
              <p className="text-neutral-700 font-bold text-sm uppercase tracking-wider">Fabric</p>
              <div className="flex flex-wrap gap-3">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabricCustom(fabric)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 ${selectedFabricCustom === fabric
                        ? 'bg-[#281000] text-white border-[#281000] shadow-md scale-105'
                        : 'bg-transparent text-neutral-800 border-[#C8BDB2] hover:border-[#281000]'
                      }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Surprise Gift Card */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#281000] text-white min-h-[160px] border border-[#F2D27A]/20 shadow-lg">
              <div className="absolute top-4 left-0 right-0 h-[8px] bg-gradient-to-r from-[#8A5A00] via-[#F2D27A] to-[#8A5A00]" />
              <div className="absolute top-0 bottom-0 left-[58px] md:left-14 w-[8px] bg-gradient-to-b from-[#8A5A00] via-[#F2D27A] to-[#8A5A00]" />
              <div className="absolute left-6 top-0 z-20">
                <svg width="90" height="70" viewBox="0 0 90 70" fill="none" className="w-[72px] h-auto">
                  <path d="M45 35C35 25 8 12 2 18C-4 24 18 38 45 40Z" fill="#EBCB7A" />
                  <path d="M45 35C55 25 82 12 88 18C94 24 72 38 45 40Z" fill="#EBCB7A" />
                  <path d="M42 38L20 60L38 52L45 42Z" fill="#D9B35C" />
                  <path d="M48 38L70 60L52 52L45 42Z" fill="#D9B35C" />
                  <ellipse cx="45" cy="35" rx="10" ry="8" fill="#A46A3D" />
                </svg>
              </div>
              <div className="relative z-10 pl-[92px] md:pl-28 pr-6 py-6">
                <p className="uppercase tracking-[0.2em] text-[10px] font-extrabold text-[#F3D8A6] mb-1.5">
                  Something Extra, Just For You
                </p>
                <h3 className="text-xl font-bold leading-tight mb-1 text-[#FFF] tracking-tight">
                  Shop ₹4,000 & Get a Surprise Gift
                </h3>
                <p className="text-[#F7E7C7]/[.85] text-[13px] leading-relaxed">
                  Every Order Above ₹4,000 Includes A Free Mystery Garment.<br />
                  A Dress, A Skirt, Or A Top Chosen With Care By Ivera - Dada Exports Team.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#281000] text-white rounded-full py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#1a0a00] hover:shadow-md transition-all shrink-0"
                >
                  + Add To Cart
                </button>
                <button
                  onClick={() => {
                    setBuyNowProduct({
                      image: images[activeImage] || images[0],
                      name: product.name,
                      size: selectedSize,
                      print: selectedPrint || selectedFabricCustom,
                      quantity,
                      price: product.price,
                    });
                    setBuyNowOpen(true);
                  }}
                  className="flex-1 bg-[#F5D8AC] text-[#281000] rounded-full py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#ebd2a0] hover:shadow-md transition-all shrink-0"
                >
                  Buy Now
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('customization-section')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="flex-1 border-2 border-[#281000] text-[#281000] rounded-full py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#281000] hover:text-white transition-all shrink-0"
                >
                  Customization
                </button>
              </div>
            </div>

            {/* Highlights Table */}
            {hlRows.length > 0 && (
              <div className="border-t border-[#E8DED8] pt-6">
                <h3 className="text-lg font-bold text-[#281000] mb-4 uppercase tracking-wider">
                  Product Highlights
                </h3>
                <div className="overflow-hidden rounded-2xl border border-[#E8DED8]/80 shadow-sm bg-white">
                  <table className="w-full text-left text-sm border-collapse">
                    <tbody>
                      {hlRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-[#FFF9F5]' : 'bg-white'}
                        >
                          <td className="px-5 py-3.5 text-neutral-500 font-semibold w-1/4 border-b border-[#E8DED8]/30">
                            {row[0]}
                          </td>
                          <td className="px-5 py-3.5 text-[#281000] font-bold w-1/4 border-b border-[#E8DED8]/30">
                            {row[1]}
                          </td>
                          <td className="px-5 py-3.5 text-neutral-500 font-semibold w-1/4 border-b border-[#E8DED8]/30">
                            {row[2]}
                          </td>
                          <td className="px-5 py-3.5 text-[#281000] font-bold w-1/4 border-b border-[#E8DED8]/30">
                            {row[3]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-[#E8DED8] pt-6">
                <h3 className="text-lg font-bold text-[#281000] mb-3 uppercase tracking-wider">
                  Product Description
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-[#5C4D44] font-medium whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            {product.keyFeatures?.length > 0 && (
              <div className="border-t border-[#E8DED8] pt-6">
                <h3 className="text-lg font-bold text-[#281000] mb-3 uppercase tracking-wider">
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-[#5C4D44] list-disc pl-5 font-medium">
                  {product.keyFeatures.map((f, i) => (
                    <li key={i} className="leading-relaxed">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Care Instructions */}
            {product.careInstructions?.length > 0 && (
              <div className="border-t border-[#E8DED8] pt-6">
                <h3 className="text-lg font-bold text-[#281000] mb-3 uppercase tracking-wider">
                  Fabric Care Instructions
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-[#5C4D44] list-disc pl-5 font-medium">
                  {product.careInstructions.map((c, i) => (
                    <li key={i} className="leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* Customization Section */}
        <div
          id="customization-section"
          className="mt-16 bg-white rounded-[32px] shadow-sm border border-[#EFE5DE] p-6 md:p-10 scroll-mt-24"
        >
          <div className="border-b border-stone-100 pb-6 mb-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#281000]">
              Customization - Your Size. Your Fit. Your Style.
            </h2>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-[#7C6C63] font-semibold">
              Custom-Tailored, Export-Quality - Crafted Just For You
            </p>
          </div>

          {/* Fabric Swatch Grid */}
          <div className="rounded-2xl bg-[#FFFBF8] border border-[#F2E5DB]/70 p-6 mb-8">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#281000] mb-6">
              Choose Your Fabric - First, Tell Us Your Fabric
            </h3>
            <div className="flex flex-wrap gap-6 justify-start">
              {fabricSwatches.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setSelectedFabricCustom(swatch.name)}
                  className="flex flex-col items-center focus:outline-none"
                >
                  <div
                    className={`relative w-[76px] h-[76px] rounded-full overflow-hidden transition-all duration-300 ${selectedFabricCustom === swatch.name
                        ? 'ring-[3.5px] ring-[#281000] ring-offset-2 scale-110'
                        : 'border border-stone-200 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <Image src={swatch.img} alt={swatch.name} fill className="object-cover" />
                  </div>
                  <span
                    className={`mt-3 text-xs tracking-wider font-semibold ${selectedFabricCustom === swatch.name
                        ? 'font-bold text-[#281000]'
                        : 'text-neutral-500'
                      }`}
                  >
                    {swatch.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Details Grid Form */}
          <form onSubmit={handleCustomOrderSubmit} className="space-y-8">
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">
                {submitError}
              </div>
            )}

            {/* How to Measure Guide */}
            <HowToMeasure />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Col 1: Personal Details */}
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-2 mb-4">
                  <h4 className="font-bold text-sm text-[#281000] uppercase tracking-wider">
                    Personal Details & Special Requests
                  </h4>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First and last name"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 your number"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Delivery City & State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Delivery Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    value={custPincode}
                    onChange={(e) => setCustPincode(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                    Occasion / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Holiday, Wedding, Daily wear"
                    value={custOccasion}
                    onChange={(e) => setCustOccasion(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-[#FFFBF8] border border-[#C8BDB2] rounded-2xl outline-none focus:border-[#281000] text-[#281000] placeholder-[#281000]/40 font-medium"
                  />
                </div>
              </div>

              {/* Col 2: Body Measurements */}
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-2 mb-4">
                  <h4 className="font-bold text-sm text-[#281000] uppercase tracking-wider">
                    Body Measurements
                  </h4>
                </div>
                {renderMeasurementInput('height', 'Height', 'e.g. 162 cm / 5 ft 4 in')}
                {renderMeasurementInput('bust', 'Bust / Breast Size', 'e.g. 36 inches')}
                {renderMeasurementInput('waist', 'Waist', 'e.g. 28 inches')}
                {renderMeasurementInput('belly', 'Belly / Tummy Size', 'e.g. 34 inches')}
                {renderMeasurementInput('hip', 'Hip Size', 'e.g. 38 inches')}
              </div>

              {/* Col 3: Length Measurements */}
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-2 mb-4">
                  <h4 className="font-bold text-sm text-[#281000] uppercase tracking-wider">
                    Length Measurements
                  </h4>
                </div>
                {renderMeasurementInput('shoulder', 'Shoulder Width', 'e.g. 14 inches')}
                {renderMeasurementInput('chest', 'Chest Width (Front)', 'e.g. 15 inches')}
                {renderMeasurementInput('topLength', 'Top Length / Blouse Length', 'e.g. 15 inches')}
                {renderMeasurementInput('skirtLength', 'Skirt / Dress Length', 'e.g. 42 inches')}
                {renderMeasurementInput('inseam', 'Inseam / Trouser Length', 'e.g. 30 inches')}
                {renderMeasurementInput('backLength', 'Back Length', 'e.g. 16 inches')}
              </div>

              {/* Col 4: Preferred Fit */}
              <div className="space-y-5">
                <div className="border-b border-stone-200 pb-2 mb-4">
                  <h4 className="font-bold text-sm text-[#281000] uppercase tracking-wider">
                    Preferred Fit
                  </h4>
                </div>
                {renderFitSelector('Fit Preference for Top', fitTop, setFitTop, [
                  'Fitted',
                  'Semi-Fitted',
                  'Relaxed / Loose',
                ])}
                {renderFitSelector('Fit Preference for Bottom', fitBottom, setFitBottom, [
                  'Fitted',
                  'Semi-Fitted',
                  'Relaxed / Loose',
                ])}
                {renderFitSelector('Waistband Preference', waistPreference, setWaistPreference, [
                  'Elasticated (stretch)',
                  'Fixed / Stitched',
                  'Adjustable Tie',
                  'Drawstring',
                ])}
                {renderFitSelector(
                  'Neckline Depth Preference',
                  necklinePreference,
                  setNecklinePreference,
                  ['Standard', 'Slightly Deeper', 'Conservative / Modest']
                )}
                {renderFitSelector('Back Style Preference', backPreference, setBackPreference, [
                  'Open Back',
                  'Partially Open',
                  'Fully Covered',
                ])}
              </div>

            </div>

            {/* Customization sticky/summary bar */}
            <div className="mt-12 bg-[#FFF9F5] border border-[#F2E5DB] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-6 text-sm text-[#281000] font-semibold">
                <div className="flex gap-2 items-center">
                  <span className="text-neutral-500 uppercase text-xs tracking-wider">Product Price:</span>
                  <span className="text-lg font-bold">{formattedPrice}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-neutral-500 uppercase text-xs tracking-wider">Customization Fee:</span>
                  <span className="text-lg font-bold text-green-700">+ ₹149.00</span>
                </div>
                <div className="flex gap-2 items-center border-t md:border-t-0 md:border-l border-[#F2E5DB] pt-2 md:pt-0 md:pl-6">
                  <span className="text-[#281000] uppercase text-xs tracking-widest font-extrabold">Total Amount:</span>
                  <span className="text-2xl font-black text-[#281000]">
                    ₹{(product.price + 149).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#281000] hover:bg-[#1a0a00] text-white h-14 px-8 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center transition-all duration-300 w-full md:w-auto shrink-0 shadow-md disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Submitting Request...'
                  : `Pay ₹${(product.price + 149).toLocaleString('en-IN')} & Place Order →`}
              </button>
            </div>

          </form>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-20 pt-8 border-t border-[#E8DED8]/60">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#281000] text-center mb-12 uppercase tracking-widest">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similar.map((prod) => (
                <Link
                  key={prod._id}
                  href={`/retail/product/${prod.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E8DED8]/50"
                >
                  <div className="relative h-[320px] overflow-hidden bg-gray-100">
                    <Image
                      src={prod.images?.[0] || '/retail/home/7.png'}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-[#281000] mb-2 line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-4 font-medium">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-50">
                      <span className="px-4 py-1.5 border border-[#281000] text-[#281000] rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-[#281000] group-hover:text-white transition-all">
                        Details →
                      </span>
                      <div className="flex gap-1.5">
                        {(prod.colors || []).slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FFF9F5] rounded-[32px] border border-[#E8DED8] p-8 max-w-lg w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-200">
              <svg className="w-8 h-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#281000] mb-3">Customization Request Sent!</h3>
            <p className="text-sm text-neutral-700 leading-relaxed mb-6 font-medium">
              Thank you, <span className="font-extrabold text-[#281000]">{custName}</span>! Your measurements and styling choices for <span className="italic font-bold text-[#281000]">{product.name}</span> have been submitted successfully.
            </p>
            <div className="bg-[#FFF3E3] border border-[#F2D27A]/30 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-sm">
              <p className="text-neutral-700">
                <span className="font-extrabold text-amber-900 uppercase text-xs tracking-wider block">WhatsApp Contact:</span> {custPhone}
              </p>
              <p className="text-neutral-700">
                <span className="font-extrabold text-amber-900 uppercase text-xs tracking-wider block">Email:</span> {custEmail}
              </p>
              <p className="text-neutral-700">
                <span className="font-extrabold text-amber-900 uppercase text-xs tracking-wider block">Customized Price Quote:</span>
                <span className="text-lg font-bold text-[#281000]">₹{(product.price + 149).toLocaleString('en-IN')}</span>
              </p>
              <p className="text-xs text-neutral-600 mt-3 pt-3 border-t border-stone-200/50 leading-relaxed">
                Since all customized garments are hand-tailored, our styling specialists will reach out via WhatsApp/Email within 24 hours to confirm your measurements and guide you with the secure payment link.
              </p>
            </div>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-[#281000] hover:bg-[#1a0a00] text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition shadow-md w-full"
            >
              Back to Product
            </button>
          </div>
        </div>
      )}

      <CheckoutDrawer open={buyNowOpen} onClose={() => setBuyNowOpen(false)} product={buyNowProduct} />
    </>
  );
}

/* ─── How to Measure Guide ───────────────────────────────────── */

const BODY_MEASUREMENTS = [
  {
    label: 'Height',
    desc:  'Stand straight against a wall without footwear. Measure from the floor to the top of your head.',
    svg: (
      <svg viewBox="0 0 60 120" fill="none" className="w-10 h-20">
        <line x1="30" y1="5" x2="30" y2="115" stroke="#281000" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="20" y1="5"  x2="40" y2="5"   stroke="#281000" strokeWidth="1.5" />
        <line x1="20" y1="115" x2="40" y2="115" stroke="#281000" strokeWidth="1.5" />
        <circle cx="30" cy="18" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 35 Q30 28 38 35 L40 65 Q30 68 20 65 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M20 65 L18 95 M40 65 L42 95" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Bust / Breast Size',
    desc:  'Wrap the tape around the fullest part of your chest, across your nipple line. Keep the tape parallel to the floor. Do not pull tight — keep it comfortably snug.',
    svg: (
      <svg viewBox="0 0 60 80" fill="none" className="w-10 h-14">
        <circle cx="30" cy="12" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 27 Q30 20 38 27 L40 55 Q30 58 20 55 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M15 36 Q30 42 45 36" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="15" y1="33" x2="15" y2="39" stroke="#281000" strokeWidth="1.2" />
        <line x1="45" y1="33" x2="45" y2="39" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Waist',
    desc:  'Measure around the narrowest part of your natural waist, usually just above your belly button. Breathe out gently before measuring.',
    svg: (
      <svg viewBox="0 0 60 80" fill="none" className="w-10 h-14">
        <circle cx="30" cy="12" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 27 Q30 20 38 27 L40 55 Q30 58 20 55 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M19 43 Q30 47 41 43" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="19" y1="40" x2="19" y2="46" stroke="#281000" strokeWidth="1.2" />
        <line x1="41" y1="40" x2="41" y2="46" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Belly / Tummy Size',
    desc:  'Measure around the fullest part of your belly — typically 2–3 inches below your belly button. This is the widest point of your midsection.',
    svg: (
      <svg viewBox="0 0 60 80" fill="none" className="w-10 h-14">
        <circle cx="30" cy="12" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 27 Q30 20 38 27 L42 58 Q30 62 18 58 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M16 50 Q30 56 44 50" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="16" y1="47" x2="16" y2="53" stroke="#281000" strokeWidth="1.2" />
        <line x1="44" y1="47" x2="44" y2="53" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Hip Size',
    desc:  'Measure around the fullest part of your hips and seat, usually about 8–9 inches below your natural waist.',
    svg: (
      <svg viewBox="0 0 60 90" fill="none" className="w-10 h-16">
        <circle cx="30" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 25 Q30 18 38 25 L44 60 Q30 65 16 60 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M14 58 Q30 65 46 58" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="14" y1="55" x2="14" y2="61" stroke="#281000" strokeWidth="1.2" />
        <line x1="46" y1="55" x2="46" y2="61" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
];

const LENGTH_MEASUREMENTS = [
  {
    label: 'Shoulder Width',
    desc:  'Measure from the tip of one shoulder across to the tip of the other shoulder, across the back.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-14 h-10">
        <circle cx="40" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M10 30 Q40 22 70 30 L68 50 Q40 54 12 50 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <line x1="10" y1="24" x2="70" y2="24" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="10" y1="20" x2="10" y2="28" stroke="#281000" strokeWidth="1.2" />
        <line x1="70" y1="20" x2="70" y2="28" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Chest Width (Front)',
    desc:  'Measure across the front of your chest from armhole to armhole, at the fullest point.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-14 h-10">
        <circle cx="40" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M15 28 Q40 20 65 28 L63 50 Q40 54 17 50 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <line x1="20" y1="32" x2="60" y2="32" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="20" y1="29" x2="20" y2="35" stroke="#281000" strokeWidth="1.2" />
        <line x1="60" y1="29" x2="60" y2="35" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Top Length / Blouse Length',
    desc:  'Measure from the highest point of your shoulder down to where you want the top to end. For crop tops, this is typically 12–16 inches.',
    svg: (
      <svg viewBox="0 0 60 90" fill="none" className="w-10 h-16">
        <circle cx="30" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M18 25 Q30 18 42 25 L44 55 Q30 58 16 55 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <line x1="48" y1="23" x2="48" y2="55" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="44" y1="23" x2="52" y2="23" stroke="#281000" strokeWidth="1.2" />
        <line x1="44" y1="55" x2="52" y2="55" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Skirt / Dress Length',
    desc:  'Measure from your natural waist down to where you want the garment to end. For maxis, measure to the floor. For minis, measure to your preferred hem.',
    svg: (
      <svg viewBox="0 0 60 120" fill="none" className="w-10 h-20">
        <circle cx="30" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M22 25 Q30 18 38 25 L44 115 Q30 118 16 115 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <line x1="48" y1="36" x2="48" y2="115" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="44" y1="36" x2="52" y2="36" stroke="#281000" strokeWidth="1.2" />
        <line x1="44" y1="115" x2="52" y2="115" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Inseam / Trouser Length',
    desc:  'Measure from your crotch down to your ankle along the inner leg. Best measured on a pair of well-fitting trousers you already own.',
    svg: (
      <svg viewBox="0 0 60 120" fill="none" className="w-10 h-20">
        <circle cx="30" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M18 25 Q30 18 42 25 L44 65 L38 115 M16 65 L22 115" stroke="#281000" strokeWidth="1.2" fill="none" />
        <path d="M16 65 L44 65" stroke="#281000" strokeWidth="1" />
        <line x1="48" y1="65" x2="48" y2="115" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="44" y1="65" x2="52" y2="65" stroke="#281000" strokeWidth="1.2" />
        <line x1="44" y1="115" x2="52" y2="115" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: 'Back Length',
    desc:  'Measure from the base of your neck (the prominent bone at the top of your spine) straight down to your natural waist.',
    svg: (
      <svg viewBox="0 0 60 90" fill="none" className="w-10 h-16">
        <circle cx="30" cy="10" r="7" stroke="#281000" strokeWidth="1.2" />
        <path d="M18 25 Q30 18 42 25 L40 75 Q30 78 20 75 Z" stroke="#281000" strokeWidth="1.2" fill="none" />
        <line x1="48" y1="24" x2="48" y2="52" stroke="#281000" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <line x1="44" y1="24" x2="52" y2="24" stroke="#281000" strokeWidth="1.2" />
        <line x1="44" y1="52" x2="52" y2="52" stroke="#281000" strokeWidth="1.2" />
      </svg>
    ),
  },
];

function HowToMeasure() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#E8DED8] overflow-hidden bg-[#FFFBF8]">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#281000]/8 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#281000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#281000] uppercase tracking-wider">How to Measure</p>
            <p className="text-xs text-[#7C6C63] font-medium">Tap to view the complete measurement guide with illustrations</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-[#281000] transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-[#E8DED8] px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2">

            {/* Body Measurements column */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#281000] mb-6 pb-2 border-b border-[#E8DED8]">
                Body Measurements
              </h4>
              <div className="space-y-7">
                {BODY_MEASUREMENTS.map((item) => (
                  <div key={item.label} className="flex items-start gap-5">
                    {/* Illustration */}
                    <div className="shrink-0 w-14 flex items-center justify-center opacity-70">
                      {item.svg}
                    </div>
                    {/* Text */}
                    <div>
                      <p className="text-[13px] font-bold text-[#281000] mb-1">{item.label} :</p>
                      <p className="text-[12px] text-[#5C4D44] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Length Measurements column */}
            <div className="mt-8 lg:mt-0">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#281000] mb-6 pb-2 border-b border-[#E8DED8]">
                Length Measurements
              </h4>
              <div className="space-y-7">
                {LENGTH_MEASUREMENTS.map((item) => (
                  <div key={item.label} className="flex items-start gap-5">
                    {/* Illustration */}
                    <div className="shrink-0 w-14 flex items-center justify-center opacity-70">
                      {item.svg}
                    </div>
                    {/* Text */}
                    <div>
                      <p className="text-[13px] font-bold text-[#281000] mb-1">{item.label} :</p>
                      <p className="text-[12px] text-[#5C4D44] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tip banner */}
          <div className="mt-8 bg-[#FFF3E3] border border-[#F2D27A]/40 rounded-xl px-5 py-3.5 flex items-start gap-3">
            <svg className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[12px] text-amber-900 font-medium leading-relaxed">
              <span className="font-extrabold">Pro Tip:</span> Always measure over your innerwear (not over clothes). Use a soft measuring tape and keep it parallel to the floor for all circumference measurements. When in doubt, measure twice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
