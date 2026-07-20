'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function B2BProductDetail({ product, similar = [] }) {
  const images = product.images?.length
    ? product.images
    : ['/b2b/NewArrivals/1.png'];

  const [mainImage,    setMainImage]    = useState(images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.hex || '');
  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0] || '');
  const [quantity,      setQuantity]      = useState(product.moq || 50);

  const [cartToast, setCartToast] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('b2b_cart') || '[]');
    const idx  = cart.findIndex(
      (item) => item.slug === product.slug && item.size === selectedSize
    );
    if (idx !== -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({
        slug:     product.slug,
        name:     product.name,
        image:    images[0],
        size:     selectedSize,
        color:    selectedColor,
        quantity,
        moq:      product.moq,
      });
    }
    localStorage.setItem('b2b_cart', JSON.stringify(cart));
    setCartToast(true);
    setTimeout(() => setCartToast(false), 2500);
  };

  const formattedPrice = product.price
    ? `₹${product.price.toLocaleString('en-IN')}`
    : null;

  // Build highlight rows: pair them into groups of 2 for the 4-column table
  const highlights = product.highlights || [];
  const highlightRows = [];
  for (let i = 0; i < highlights.length; i += 2) {
    highlightRows.push([
      highlights[i]?.label  || '',
      highlights[i]?.value  || '',
      highlights[i + 1]?.label || '',
      highlights[i + 1]?.value || '',
    ]);
  }

  return (
    <div className="w-full bg-[#FFFEF9] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-10 pb-20">

        {/* ── Main product section ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">

          {/* Left — images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-xl bg-white">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square relative rounded-xl overflow-hidden transition-all ${
                      mainImage === img
                        ? 'ring-2 ring-[#95565E] ring-offset-1'
                        : 'ring-1 ring-gray-200 hover:ring-[#95565E]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — details */}
          <div className="pt-2">
            {/* Breadcrumb */}
            {product.breadcrumbLabel && (
              <p className="text-sm text-gray-500 mb-3">{product.breadcrumbLabel}</p>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0E0E0E] leading-tight mb-5">
              {product.name}
            </h1>

            {/* Price + MOQ */}
            <div className="flex items-baseline gap-4 mb-7">
              {formattedPrice && (
                <p className="text-3xl sm:text-4xl font-bold text-[#0E0E0E]">{formattedPrice}</p>
              )}
              <p className="text-[#0E0E0E] text-sm font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                MOQ: {product.moq}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-7">
                <p className="text-sm font-medium mb-3 text-[#0E0E0E]">Size</p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-[#95565E] text-white'
                          : 'border border-gray-300 text-gray-700 hover:border-[#95565E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-medium mb-3 text-[#0E0E0E]">Colors</p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color.hex)}
                      title={color.name}
                      className={`w-8 h-8 rounded-full transition-all transform hover:scale-110 ${
                        selectedColor === color.hex
                          ? 'ring-2 ring-offset-2 ring-[#95565E] scale-110'
                          : 'shadow-md hover:shadow-lg'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-medium text-[#0E0E0E] mb-3">Minimum Order Quantity</p>
              <div className="flex items-center justify-between w-[180px] h-[48px] border border-[#CDBEB5] rounded-full px-5">
                <button
                  onClick={() => setQuantity((prev) => Math.max(product.moq || 50, prev - 1))}
                  className="text-2xl leading-none font-light text-black"
                >
                  −
                </button>
                <span className="text-base text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="text-2xl leading-none font-light text-black"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum Order: {product.moq} Pieces</p>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <Link
                href={`/b2b/enquiry?product=${product.slug}&name=${encodeURIComponent(product.name)}&size=${selectedSize}&qty=${quantity}`}
                className="h-[54px] flex items-center justify-center rounded-full bg-[#95565E] text-white font-semibold hover:bg-[#7a3f47] transition text-sm"
              >
                Enquire Now
              </Link>
              <button
                onClick={addToCart}
                className="h-[54px] rounded-full border-2 border-[#95565E] text-[#95565E] font-semibold hover:bg-[#95565E] hover:text-white transition text-sm relative"
              >
                {cartToast ? '✓ Added to Cart' : 'Add To Cart'}
              </button>
            </div>

            {/* Cart toast */}
            {cartToast && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-white text-sm font-medium px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-bounce-once">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {quantity} pcs added to cart
                <Link href="/b2b/cart" className="ml-1 text-[#95565E] font-semibold underline underline-offset-2">
                  View Cart →
                </Link>
              </div>
            )}

            {/* Product Info Sections */}
            <div className="space-y-10 text-[#0E0E0E]">

              {/* Highlights Table */}
              {highlightRows.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-5">Product Highlights</h3>
                  <div className="overflow-hidden rounded-xl border border-[#E8E0D8]">
                    {highlightRows.map((row, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-2 md:grid-cols-4 ${
                          idx % 2 === 0 ? 'bg-[#F9F4E1]' : 'bg-white'
                        }`}
                      >
                        <div className="px-4 md:px-5 py-4 border-r border-b border-[#E8E0D8]">
                          <p className="text-[12px] text-[#A89899]">{row[0]}</p>
                        </div>
                        <div className="px-4 md:px-5 py-4 border-b md:border-r border-[#E8E0D8]">
                          <p className="text-[13px] font-medium text-[#0E0E0E]">{row[1]}</p>
                        </div>
                        <div className="hidden md:block px-5 py-4 border-r border-b border-[#E8E0D8]">
                          <p className="text-[12px] text-[#A89899]">{row[2]}</p>
                        </div>
                        <div className="hidden md:block px-5 py-4 border-b border-[#E8E0D8]">
                          <p className="text-[13px] font-medium text-[#0E0E0E]">{row[3]}</p>
                        </div>
                        {row[2] && (
                          <div className="md:hidden px-4 py-4 border-r border-[#E8E0D8]">
                            <p className="text-[12px] text-[#A89899]">{row[2]}</p>
                          </div>
                        )}
                        {row[3] && (
                          <div className="md:hidden px-4 py-4">
                            <p className="text-[12px] font-medium text-[#0E0E0E]">{row[3]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="border-t border-[#E8E0D8] pt-8">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[#3C2F2F]">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures?.length > 0 && (
                <div className="border-t border-[#E8E0D8] pt-8">
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2.5 text-sm md:text-base text-[#3C2F2F] list-disc pl-5">
                    {product.keyFeatures.map((f, i) => (
                      <li key={i} className="leading-relaxed">{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Care Instructions */}
              {product.careInstructions?.length > 0 && (
                <div className="border-t border-[#E8E0D8] pt-8">
                  <h3 className="text-xl font-semibold mb-4">Fabric Care Instructions</h3>
                  <ul className="space-y-2 text-sm md:text-base text-[#3C2F2F] list-disc pl-5">
                    {product.careInstructions.map((c, i) => (
                      <li key={i} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-b border-[#E8E0D8]" />
            </div>
          </div>
        </div>

        {/* ── Similar Products ───────────────────────────── */}
        {similar.length > 0 && (
          <div className="mt-16 pt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#95565E] text-center mb-12">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similar.map((prod) => (
                <Link
                  key={prod._id}
                  href={`/b2b/product/${prod.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-[320px] overflow-hidden bg-gray-100">
                    <Image
                      src={prod.images?.[0] || '/b2b/NewArrivals/1.png'}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-[#0E0E0E] mb-2 line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#3C2F2F] leading-relaxed line-clamp-2 mb-4">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-4 py-1.5 border border-[#95565E] text-[#95565E] rounded-full text-xs font-medium group-hover:bg-[#95565E] group-hover:text-white transition">
                        Enquire →
                      </span>
                      <div className="flex gap-1.5">
                        {(prod.colors || []).slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full shadow-sm"
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
    </div>
  );
}
