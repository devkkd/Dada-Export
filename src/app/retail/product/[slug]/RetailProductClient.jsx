'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import CheckoutDrawer from '@/components/retail/CheckoutDrawer';
import { useRetailAuth } from '@/context/RetailAuthContext';

export default function RetailProductClient({ product, similar = [] }) {
  const images  = product.images?.length ? product.images : ['/retail/home/7.png', '/retail/home/8.png', '/retail/home/9.png', '/retail/home/10.png'];
  const prints  = product.prints?.length ? product.prints : [];
  const sizes   = product.variants?.map((v) => v.size) || ['Small', 'Medium', 'Large'];

  const [activeImage, setActiveImage]           = useState(0);
  const [selectedPrint, setSelectedPrint]       = useState(prints[0] || '');
  const [selectedSize, setSelectedSize]         = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor]       = useState(product.colors?.[0]?.name || '');
  const [quantity, setQuantity]                 = useState(1);
  const [selectedFabricCustom, setSelectedFabricCustom] = useState('Cotton');
  const [topFit, setTopFit]       = useState('Fitted');
  const [bottomFit, setBottomFit] = useState('Fitted');
  const [waistBand, setWaistBand] = useState('Elasticated');
  const [backStyle, setBackStyle] = useState('Open Back');
  const [bodyUnit, setBodyUnit]   = useState('IN');
  const [lengthUnit, setLengthUnit] = useState('IN');
  const [buyNowOpen, setBuyNowOpen]   = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const { isLoggedIn } = useRetailAuth();
  const formattedPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '₹0.00';
  const formattedMRP   = product.mrp   ? `₹${product.mrp.toLocaleString('en-IN')}`   : null;

  // Build highlight rows (pairs)
  const highlights = product.highlights || [];
  const hlRows = [];
  for (let i = 0; i < highlights.length; i += 2) {
    hlRows.push([highlights[i]?.label || '', highlights[i]?.value || '', highlights[i+1]?.label || '', highlights[i+1]?.value || '']);
  }

  const handleAddToCart = async () => {
    const item = {
      id:      product._id,
      productId: product._id,
      name:    product.name,
      image:   images[activeImage],
      price:   product.price,
      size:    selectedSize,
      print:   selectedPrint,
      color:   selectedColor,
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
            size:       item.size,
            color:      item.color,
            quantity:   item.quantity,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not add to cart');
        setToastMessage('Product added to cart');
        window.setTimeout(() => setToastMessage(''), 2500);
        return;
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

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#281000] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transition-all animate-bounce">
            {toastMessage}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* LEFT: IMAGE GALLERY */}
          <div className="col-span-1 lg:col-span-5 space-y-5 lg:top-28 self-start">
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[500px] xl:h-[580px] 2xl:h-[650px] rounded-[24px] overflow-hidden border border-[#E8DED8]">
              <Image src={images[activeImage]} alt={product.name} fill className="object-cover transition-all duration-500" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-[16px] overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-[#281000] scale-105' : 'border-[#E6DDD6] hover:border-[#281000]'}`}>
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="space-y-8">
            <div className="pb-3">
              <h1 className="text-[26px] lg:text-[26px] font-medium text-[#0E0E0E] leading-[1.15]" style={{ fontFamily: 'Mona Sans, sans-serif' }}>
                {product.name}
              </h1>
              {product.breadcrumbLabel && (
                <p className="text-sm md:text-[16px] text-neutral-950/80 mt-3">{product.breadcrumbLabel}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <p className="text-3xl font-semibold text-[#0E0E0E]">{formattedPrice}</p>
                {formattedMRP && product.mrp > product.price && (
                  <p className="text-lg text-gray-400 line-through">{formattedMRP}</p>
                )}
                <span className="px-5 py-2 rounded-full bg-green-600 text-white text-sm">Available</span>
                <p className="text-[16px] text-neutral-950/70">Free Delivery on Orders Above ₹999</p>
              </div>
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <p className="text-neutral-950/75 mb-2 font-normal text-[18px]">Size</p>
                <div className="flex flex-wrap gap-4">
                  {sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`px-7 py-2 rounded-full border transition-all duration-300 ${selectedSize === size ? 'bg-[#281000] text-white border-[#281000]' : 'bg-transparent text-black border-[#C8BDB2]'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prints */}
            {prints.length > 0 && (
              <div>
                <p className="text-neutral-950/75 mb-2 font-normal text-[18px]">Prints</p>
                <div className="flex flex-wrap gap-4">
                  {prints.map((print) => (
                    <button key={print} onClick={() => setSelectedPrint(print)}
                      className={`px-6 py-2 rounded-full border transition-all duration-300 ${selectedPrint === print ? 'bg-[#281000] text-white border-[#281000]' : 'bg-transparent text-black border-[#C8BDB2]'}`}>
                      {print}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Surprise Gift Card */}
            <div className="relative overflow-hidden rounded-[24px] bg-[#2B0D00] text-white min-h-[180px] md:min-h-[160px]">
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
              <div className="relative z-10 pl-[92px] md:pl-28 pr-4 md:pr-6 py-6 md:py-7">
                <p className="uppercase tracking-[0.15em] text-[11px] font-bold text-[#F3D8A6] mb-2">Something Extra, Just For You</p>
                <h3 className="text-[20px] md:text-[22px] font-semibold leading-tight mb-2">Shop ₹4,000 & Get a Surprise Gift</h3>
                <p className="text-[#F7E7C7]/[.90] text-[13px] md:text-[14px] leading-6 max-w-2xl">
                  Every Order Above ₹4,000 Includes A Free Mystery Garment.<br />A Dress, A Skirt, Or A Top Chosen With Care<br />By Ivera - Dada Exports Team.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2">
              <div className="flex flex-col lg:flex-row gap-5">
                <button onClick={handleAddToCart} className="flex-1 bg-[#281000] text-white rounded-full py-4 font-medium">+ Add To Cart</button>
                <button onClick={() => { setBuyNowProduct({ image: images[activeImage], name: product.name, size: selectedSize, print: selectedPrint, quantity, price: product.price }); setBuyNowOpen(true); }}
                  className="flex-1 bg-[#F2D9AE] text-[#0E0E0E] rounded-full py-4 font-medium">Buy Now</button>
                <button onClick={() => document.getElementById('customization-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="flex-1 border border-stone-800/25 rounded-full py-4 text-[#0E0E0E] hover:bg-[#281000] hover:text-white transition-all">Customization</button>
              </div>
            </div>

            {/* Product Highlights Table */}
            {hlRows.length > 0 && (
              <div className="mt-10 border-t border-stone-800/15 pt-6">
                <h3 className="text-[20px] font-semibold text-[#0E0E0E] mb-6">Product Highlights</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-2 text-sm">
                    <tbody>
                      {hlRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#F2DDB6]' : ''}>
                          <td className="px-4 py-3 text-[#AE9D9F] w-1/4">{row[0]}</td>
                          <td className="px-4 py-3 text-[#0E0E0E] w-1/4">{row[1]}</td>
                          <td className="px-4 py-3 text-[#AE9D9F] w-1/4">{row[2]}</td>
                          <td className="px-4 py-3 text-[#0E0E0E] w-1/4">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-stone-800/15 pt-6">
                <h3 className="text-[20px] font-semibold text-[#0E0E0E] mb-4">Product Description</h3>
                <p className="text-sm md:text-base leading-relaxed text-[#3C2F2F]">{product.description}</p>
              </div>
            )}

            {/* Key Features */}
            {product.keyFeatures?.length > 0 && (
              <div className="border-t border-stone-800/15 pt-6">
                <h3 className="text-[20px] font-semibold text-[#0E0E0E] mb-4">Key Features</h3>
                <ul className="space-y-2 text-sm md:text-base text-[#3C2F2F] list-disc pl-5">
                  {product.keyFeatures.map((f, i) => <li key={i} className="leading-relaxed">{f}</li>)}
                </ul>
              </div>
            )}

            {/* Care Instructions */}
            {product.careInstructions?.length > 0 && (
              <div className="border-t border-stone-800/15 pt-6">
                <h3 className="text-[20px] font-semibold text-[#0E0E0E] mb-4">Fabric Care Instructions</h3>
                <ul className="space-y-2 text-sm md:text-base text-[#3C2F2F] list-disc pl-5">
                  {product.careInstructions.map((c, i) => <li key={i} className="leading-relaxed">{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customization Section */}
        <div id="customization-section" className="mt-8 md:mt-10 bg-white rounded-[28px] shadow-lg border border-[#EFE5DE] p-5 md:p-10 scroll-mt-24">
          <h2 className="text-[22px] md:text-[30px] font-semibold leading-tight text-[#281000]">Customization - Your Size. Your Fit. Your Style.</h2>
          <p className="mt-2 text-[14px] md:text-base leading-7 text-[#6F625A]">Custom-Tailored, Export-Quality - Crafted Just For You</p>

          {/* Fabric */}
          <div className="mt-8 rounded-2xl bg-[#FFF9F5] border border-[#F2E5DB] p-5">
            <h3 className="font-semibold text-[#2A221E] mb-6">Choose Your Fabric</h3>
            <div className="flex flex-wrap gap-6">
              {['Cotton','Rayon','Silk','Georgette','Denim'].map((fabric) => (
                <button key={fabric} onClick={() => setSelectedFabricCustom(fabric)} className="text-center">
                  <div className={`relative w-[70px] h-[70px] rounded-full overflow-hidden mx-auto transition-all duration-300 ${selectedFabricCustom === fabric ? 'border-[3px] border-[#281000] scale-105' : 'border border-[#C8BDB2]'}`}>
                    <Image src="/retail/newArrivals/7.png" alt={fabric} fill className="object-cover" />
                  </div>
                  <p className={`mt-2 text-sm ${selectedFabricCustom === fabric ? 'font-semibold text-[#0E0E0E]' : 'text-[#2A221E]'}`}>{fabric}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color selection (from DB colors) */}
          <div className="mt-6 rounded-2xl bg-[#FFF9F5] border border-[#F2E5DB] p-5">
            <h3 className="font-semibold text-[#2A221E] mb-6">Choose Your Colour</h3>
            <div className="flex flex-wrap gap-6">
              {(product.colors?.length ? product.colors : [{ name: 'Olive Green', hex: '#6B7B4F' },{ name: 'Black', hex: '#1F1F1F' },{ name: 'Ivory', hex: '#F7F4ED' }]).map((color) => (
                <button key={color.name} onClick={() => setSelectedColor(color.name)} className="text-center group">
                  <div className={`relative w-[52px] h-[52px] rounded-full transition-all duration-300 flex items-center justify-center ${selectedColor === color.name ? 'ring-[3px] ring-[#281000] ring-offset-4 scale-105' : ''}`}
                    style={{ backgroundColor: color.hex || color.code }}>
                    {selectedColor === color.name && (
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className={`mt-3 text-[14px] ${selectedColor === color.name ? 'font-semibold text-[#281000]' : 'text-[#555]'}`}>{color.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-16 pt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#281000] text-center mb-12">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similar.map((prod) => (
                <Link key={prod._id} href={`/retail/product/${prod.slug}`} className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-[320px] overflow-hidden bg-gray-100">
                    <Image src={prod.images?.[0] || '/retail/home/7.png'} alt={prod.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 25vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-[#0E0E0E] mb-2 line-clamp-2">{prod.name}</h3>
                    <p className="text-xs text-[#3C2F2F] leading-relaxed line-clamp-2 mb-4">{prod.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-4 py-1.5 border border-[#281000] text-[#281000] rounded-full text-xs font-medium group-hover:bg-[#281000] group-hover:text-white transition">
                        Add to Cart →
                      </span>
                      <div className="flex gap-1.5">
                        {(prod.colors || []).slice(0, 4).map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.hex }} title={c.name} />
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

    <CheckoutDrawer open={buyNowOpen} onClose={() => setBuyNowOpen(false)} product={buyNowProduct} />
    </>
  );
}
