// components/NewArrivalSection.tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useB2BData } from '@/components/b2b/B2BDataContext';

export default function NewArrivalSection() {
  const { newArrivals, categories } = useB2BData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedColors, setSelectedColors] = useState({});

  // Build category tabs dynamically from DB top-level categories
  const categoryTabs = ['All', ...categories.filter((c) => !c.parentId).map((c) => c.name)];

  const filteredProducts =
    activeCategory === 'All'
      ? newArrivals
      : newArrivals.filter((product) => {
          const cat = categories.find((c) => String(c._id) === String(product.category));
          return cat?.name === activeCategory;
        });

  // Don't render section if no products in DB yet
  if (newArrivals.length === 0) return null;

  return (
    <section className="w-full bg-[#FFFEF9] py-8 sm:py-16 md:py-20">
     <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
         <div>
  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
    <div className="w-14 sm:w-24 h-[1px] bg-[#95565E]"></div>

    <span className="text-[11px] sm:text-[14px] tracking-wide uppercase text-[#95565E] font-medium">
      OUR PRODUCTS
    </span>
  </div>

 <h2 className="text-[26px] sm:text-[48px] md:text-[64px] font-medium leading-none text-[#95565E]">
    New Arrival
  </h2>
</div>

          {/* Category Tabs - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
           {categoryTabs.map((cat) => (
  <button
    key={cat}
    onClick={() => setActiveCategory(cat)}
  className={`flex-shrink-0 px-4 sm:px-6 py-2 text-[12px] sm:text-sm rounded-full whitespace-nowrap transition-all ${
      activeCategory === cat
        ? 'bg-[#95565E] text-white'
        : 'bg-white border border-gray-200 text-black'
    }`}
  >
    {cat}
  </button>
))}
          </div>
        </div>

        {/* Products Grid */}
        <Swiper
  modules={[Autoplay]}
  slidesPerView={2}
spaceBetween={12}
  loop={filteredProducts.length > 2}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
 breakpoints={{
  0: {
    slidesPerView: 2,
    spaceBetween: 10,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  1400: {
    slidesPerView: 4,
    spaceBetween: 30,
  },
}}
>

  {filteredProducts.map((product) => (

    <SwiperSlide key={product._id}>

      <Link href={`/b2b/product/${product.slug}`} className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300">

        {/* Product Image */}

       <div className="relative h-[160px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-xl sm:rounded-2xl">

          <Image
            src={product.images?.[0] || '/b2b/home/7.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />

        </div>

        {/* Content */}

        <div className="p-2 sm:p-6">

          <h3 className="text-[13px] sm:text-xl font-bold text-black mb-1 sm:mb-2 line-clamp-1">
            {product.name}
          </h3>

         <p className="text-[10.5px] sm:text-[14px] text-black/70 leading-4 sm:leading-5 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-5">
            {product.description}
          </p>

         <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mt-2 sm:mt-5">

  <button
    onClick={(e) => e.preventDefault()}
    className="w-full sm:w-auto px-3 sm:px-6 py-1.5 sm:py-2 border border-[#95565E] text-[#95565E] rounded-full text-[10.5px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all"
  >
    Enquire →
  </button>

  {/* Color swatches from DB */}
  {product.colors?.length > 0 && (
    <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
      {product.colors.slice(0, 4).map((color, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            setSelectedColors({ ...selectedColors, [product._id]: color.name });
          }}
          title={color.name}
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full transition-transform ${
            selectedColors[product._id] === color.name
              ? 'ring-2 ring-offset-1 sm:ring-offset-2 scale-125'
              : ''
          }`}
          style={{ backgroundColor: color.hex || '#ccc' }}
        />
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
         <Link
  href="/b2b/new-arrival"
  className="px-5 sm:px-10 py-2.5 sm:py-4 bg-[#95565E] hover:bg-[#8A4F57] !text-white rounded-full text-[12px] sm:text-sm font-medium flex items-center gap-2 transition-colors"
>
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