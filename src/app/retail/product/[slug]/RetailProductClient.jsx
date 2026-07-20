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

          {/* LEFT: IMAGE GALLERY */}
          <div className="col-span-1 lg:col-span-6 space-y-6">

            {/* Desktop Custom Curved Images and Rotating Badge Layout */}
            <div className="hidden lg:block relative pl-12 pr-4 py-2">
              
              {/* Overlapping Central Badge */}
              <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-36 h-36 rounded-full bg-[#FFF9F5] border-2 border-[#281000]/15 flex flex-col items-center justify-center shadow-xl text-[#281000] p-4 select-none">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Spinning text outer */}
                  <div className="absolute inset-0 animate-[spin_25s_linear_infinite] flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path id="textPath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
                      <text className="text-[7.2px] font-black fill-[#281000] tracking-[0.16em] uppercase">
                        <textPath href="#textPath" startOffset="0%">
                          • Handcrafted With Love • Delivered Worldwide
                        </textPath>
                      </text>
                    </svg>
                  </div>
                  {/* Center Globe Icon */}
                  <div className="w-16 h-16 rounded-full border border-[#281000]/10 flex items-center justify-center bg-white shadow-inner">
                    <svg className="w-8 h-8 text-[#281000]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image Stack */}
              <div className="space-y-6">
                
                {/* Top Image: Rounded Top-Left Curve */}
                <div className="relative w-full aspect-[16/11] rounded-tl-[180px] rounded-bl-[24px] rounded-tr-[32px] rounded-br-[32px] overflow-hidden border border-[#E8DED8] bg-white group shadow-sm">
                  <Image
                    src={displayImages[activeImage]}
                    alt={`${product.name} - View ${activeImage + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Image: Rounded Bottom-Left Curve */}
                <div className="relative w-full aspect-[16/11] rounded-tl-[24px] rounded-bl-[180px] rounded-tr-[32px] rounded-br-[32px] overflow-hidden border border-[#E8DED8] bg-white group shadow-sm">
                  <Image
                    src={displayImages[(activeImage + 1) % displayImages.length]}
                    alt={`${product.name} - View ${((activeImage + 1) % displayImages.length) + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Floating overlays for quality highlights */}
                  <div className="absolute right-4 bottom-4 left-20 z-10 flex flex-col items-end gap-2.5">
                    <div className="bg-[#FFF9F5]/95 text-[#281000] px-3.5 py-2 rounded-xl border border-[#E8DED8]/40 shadow-md space-y-0.5 text-right w-fit shrink-0 backdrop-blur-[2px]">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800">Premium Quality Fabric</p>
                      <p className="text-[11px] text-neutral-800 font-bold">100% Premium Rayon - Ultra Soft</p>
                    </div>
                    <div className="bg-[#FFF9F5]/95 text-[#281000] px-3.5 py-2 rounded-xl border border-[#E8DED8]/40 shadow-md space-y-1 text-right w-fit shrink-0 backdrop-blur-[2px]">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800">Wash & Care</p>
                      <div className="flex gap-2 text-[10px] text-neutral-800 font-extrabold items-center justify-end">
                        <span>🧺 Cold Wash</span>
                        <span>💨 Warm Iron</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Thumbnails list below stack */}
              <div className="flex gap-3 justify-center pt-6">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === idx ? 'border-[#281000] scale-105 shadow-md' : 'border-stone-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>

            </div>

            {/* Mobile Carousel / Thumb Slider */}
            <div className="lg:hidden space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-[24px] overflow-hidden border border-[#E8DED8] bg-white shadow-sm">
                <Image
                  src={displayImages[activeImage]}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-cover transition-all duration-300"
                />
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none justify-center">
                {displayImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === idx ? 'border-[#281000] scale-105 shadow-md' : 'border-stone-200'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
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
