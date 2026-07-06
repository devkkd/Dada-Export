// components/NewArrivalSection.tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
  {
    id: 1,
    category: 'Dresses',
    img: '/b2b/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 2,
    category: 'Dresses',
    img: '/b2b/home/8.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 3,
    category: 'Tops',
    img: '/b2b/home/9.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 4,
    category: 'Tops',
    img: '/b2b/home/10.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
  },
  {
    id: 5,
    category: 'Bottom Wear',
    img: '/b2b/home/11.png',
    title: 'Wide Leg Pants',
    desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
  },
  {
    id: 6,
    category: 'Bottom Wear',
    img: '/b2b/home/12.png',
    title: 'Printed Palazzo',
    desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
  },
  {
    id: 7,
    category: 'Accessories',
    img: '/b2b/home/13.png',
    title: 'Handcrafted Tote Bag',
    desc: 'Spacious design · Durable fabric · Stylish everyday accessory',
  },
  {
    id: 8,
    category: 'Home & Lifestyle',
    img: '/b2b/home/14.png',
    title: 'Premium Yoga Mat',
    desc: 'Eco-friendly material · Comfortable grip · Lightweight and durable',
  },
];

export default function NewArrivalSection() {
  const [activeCategory, setActiveCategory] = useState('All');
const [selectedColors, setSelectedColors] = useState({});
const filteredProducts =
  activeCategory === 'All'
    ? products
    : products.filter(
        (product) => product.category === activeCategory
      );
  return (
    <section className="w-full bg-[#FFFEF9] py-10 sm:py-16 md:py-20">
     <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
         <div>
  <div className="flex items-center gap-4 mb-8">
    <div className="w-24 h-[1px] bg-[#95565E]"></div>

    <span className="text-[14px] tracking-wide uppercase text-[#95565E] font-medium">
      OUR PRODUCTS
    </span>
  </div>

 <h2 className="text-[34px] sm:text-[48px] md:text-[64px] font-medium leading-none text-[#95565E]">
    New Arrival
  </h2>
</div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
           {['All', 'Dresses', 'Tops', 'Bottom Wear', 'Accessories', 'Home & Lifestyle'].map((cat) => (
  <button
    key={cat}
    onClick={() => setActiveCategory(cat)}
  className={`px-4 sm:px-6 py-2 text-[12px] sm:text-sm rounded-full whitespace-nowrap transition-all ${
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
  loop={true}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
 breakpoints={{
  0: {
    slidesPerView: 2,
    spaceBetween: 12,
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

    <SwiperSlide key={product.id}>

      <div className="group bg-[#FFFEF9] hover:shadow-xl transition-all duration-300">

        {/* Product Image */}

       <div className="relative h-[220px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl">

          <Image
            src={product.img}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />

        </div>

        {/* Content */}

        <div className="p-3 sm:p-6">

          <h3 className="text-[15px] sm:text-xl font-bold text-black mb-2 line-clamp-1">
            {product.title}
          </h3>

         <p className="text-[11px] sm:text-[14px] text-black/70 leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">
            {product.desc}
          </p>

         <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 mt-5">

  <button className="w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#95565E] text-[#95565E] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all">
    Enquire →
  </button>

  <div className="flex items-center justify-center sm:justify-end gap-3">
    <button
      onClick={() =>
        setSelectedColors({
          ...selectedColors,
          [product.id]: 'teal',
        })
      }
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-teal-600 ${
        selectedColors[product.id] === 'teal'
          ? 'ring-2 ring-teal-600 ring-offset-2 scale-125'
          : ''
      }`}
    />

    <button
      onClick={() =>
        setSelectedColors({
          ...selectedColors,
          [product.id]: 'blue',
        })
      }
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-600 ${
        selectedColors[product.id] === 'blue'
          ? 'ring-2 ring-blue-600 ring-offset-2 scale-125'
          : ''
      }`}
    />

    <button
      onClick={() =>
        setSelectedColors({
          ...selectedColors,
          [product.id]: 'rose',
        })
      }
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-rose-600 ${
        selectedColors[product.id] === 'rose'
          ? 'ring-2 ring-rose-600 ring-offset-2 scale-125'
          : ''
      }`}
    />

    <button
      onClick={() =>
        setSelectedColors({
          ...selectedColors,
          [product.id]: 'black',
        })
      }
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 ${
        selectedColors[product.id] === 'black'
          ? 'ring-2 ring-slate-800 ring-offset-2 scale-125'
          : ''
      }`}
    />
  </div>

</div>

        </div>

      </div>

    </SwiperSlide>

  ))}

</Swiper>

        {/* See All Button */}
        <div className="flex justify-center mt-14">
         <Link
  href="/b2b/new-arrival"
  className="px-6 sm:px-10 py-3 sm:py-4 bg-[#95565E] hover:bg-[#8A4F57] text-white rounded-full text-[13px] sm:text-sm font-medium flex items-center gap-2 transition-colors"
>
  See All New Arrival →
</Link>
        </div>
      </div>
    </section>
  );
}