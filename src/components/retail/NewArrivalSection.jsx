// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useRetailData } from '@/components/retail/RetailDataContext';
import { useRetailAuth } from '@/context/RetailAuthContext';

export default function NewArrivalSection() {
  const { newArrivals, categories } = useRetailData();
  const { isLoggedIn, refreshCartCount } = useRetailAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedColors, setSelectedColors] = useState({});
  const [cartSaving, setCartSaving] = useState({});

  const showToast = (message, isSuccess = true) => {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('retail-dynamic-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'retail-dynamic-toast';
    toast.className = `fixed bottom-5 right-5 z-[99999] px-6 py-3.5 rounded-full text-white text-xs font-semibold shadow-xl transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2 ${
      isSuccess ? 'bg-[#281000]' : 'bg-red-600'
    }`;
    toast.innerHTML = isSuccess 
      ? `<span>✓</span> <span>${message}</span>`
      : `<span>⚠</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 50);
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      document.dispatchEvent(new CustomEvent('openLoginPopup'));
      showToast('Please login to add to cart', false);
      return;
    }

    const hasCustom = product.variants?.some((v) => !['Free Size', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].includes(v.size));
    const validVariants = hasCustom ? product.variants?.filter((v) => v.size !== 'Free Size') : product.variants;
    const defaultSize = validVariants?.[0]?.size || 'M';
    const selectedColor = selectedColors[product._id] || product.colors?.[0]?.name || 'N/A';

    setCartSaving(prev => ({ ...prev, [product._id]: true }));
    try {
      const res = await fetch('/api/retail/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          size: defaultSize,
          color: selectedColor,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add to cart');

      refreshCartCount();
      showToast('Added to cart successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not add to cart', false);
    } finally {
      setCartSaving(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const categoryTabs = ['All', ...categories.filter((c) => !c.parentId).map((c) => c.name)];

  const filteredProducts =
    activeCategory === 'All'
      ? newArrivals
      : newArrivals.filter((product) => {
          const cat = categories.find((c) => String(c._id) === String(product.category));
          return cat?.name === activeCategory;
        });

  if (newArrivals.length === 0) return null;

  return (
   <section className="w-full bg-[#FFF7F2] py-8 sm:py-16 md:py-20">
<div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
    <div className="w-14 sm:w-24 h-[1px] bg-[#281000]"></div>
    <span className="text-[11px] sm:text-[14px] tracking-wide uppercase text-[#281000] font-medium">OUR PRODUCTS</span>
  </div>
<h2 className="text-[26px] sm:text-[48px] md:text-[64px] font-medium leading-none text-[#281000]">
    New Arrival
  </h2>
</div>

          {/* Category Tabs - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
           {categoryTabs.map((cat) => (
  <button key={cat} onClick={() => setActiveCategory(cat)}
   className={`flex-shrink-0 px-4 sm:px-6 py-2 text-[12px] sm:text-sm rounded-full whitespace-nowrap transition-all ${
  activeCategory === cat ? 'bg-[#281000] text-white' : 'bg-white border border-gray-200 text-black'
}`}>
    {cat}
  </button>
))}
          </div>
        </div>

        {/* Products Slider */}
<Swiper modules={[Autoplay]} loop={filteredProducts.length > 2} spaceBetween={12}
  autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
  breakpoints={{
    0:    { slidesPerView: 2, spaceBetween: 10 },
    640:  { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 },
    1400: { slidesPerView: 4, spaceBetween: 30 },
  }}
>
  {filteredProducts.map((product) => (
    <SwiperSlide key={product._id}>
      <Link href={`/retail/product/${product.slug}`} className="group block hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
       <div className="relative h-[160px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-xl sm:rounded-2xl">
          <Image src={product.images?.[0] || '/retail/home/7.png'} alt={product.name} fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        {/* Content */}
        <div className="p-2 sm:p-6">
          <h3 className="text-[13px] sm:text-xl font-bold text-black mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
         <p className="text-[10.5px] sm:text-[14px] text-black/70 leading-4 sm:leading-5 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-5">{product.description}</p>
         <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mt-2 sm:mt-5">
  <button 
    onClick={(e) => handleAddToCart(e, product)} 
    disabled={cartSaving[product._id]}
    className="w-full sm:w-auto px-3 sm:px-6 py-1.5 sm:py-2 border border-[#281000] text-[#281000] rounded-full text-[10.5px] sm:text-sm font-medium hover:bg-[#281000] hover:text-white transition-all disabled:opacity-50"
  >
    {cartSaving[product._id] ? 'Adding...' : 'Add to Cart →'}
  </button>
  {product.colors?.length > 0 && (
    <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
      {product.colors.slice(0, 4).map((color, i) => (
        <button key={i} onClick={(e) => { e.preventDefault(); setSelectedColors({ ...selectedColors, [product._id]: color.name }); }}
          title={color.name}
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-all ${selectedColors[product._id] === color.name ? 'ring-2 ring-offset-1 sm:ring-offset-2 scale-125' : ''}`}
          style={{ backgroundColor: color.hex || '#ccc' }} />
      ))}
    </div>
  )}
</div>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>

        {/* See All Button */}
        <div className="flex justify-center mt-8 sm:mt-14">
         <Link href="/retail/new-arrival" className="px-5 sm:px-10 py-2.5 sm:py-4 bg-[#281000] hover:bg-[#3a1a00] !text-white rounded-full text-[12px] sm:text-sm font-medium flex items-center gap-2 transition-colors">
  See All New Arrival →
</Link>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}