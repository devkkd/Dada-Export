// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
  {
    id: 1,
    category: 'Dresses',
    img: '/retail/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 2,
    category: 'Dresses',
    img: '/retail/home/8.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 3,
    category: 'Tops',
    img: '/retail/home/9.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 4,
    category: 'Tops',
    img: '/retail/home/10.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
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
    <section className="w-full bg-[#FFF7F2] py-16 md:py-20">
     <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
  <div className="flex items-center gap-4 mb-8">
    <div className="w-24 h-[1px] bg-[#281000]"></div>

    <span className="text-[14px] tracking-wide uppercase text-[#281000] font-medium">
      OUR PRODUCTS
    </span>
  </div>

  <h2 className="text-[52px] md:text-[64px] font-medium leading-none text-[#281000]">
    New Arrival
  </h2>
</div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
           {['All', 'Dresses', 'Tops', 'Bottom Wear', 'Accessories', 'Home & Lifestyle'].map((cat) => (
  <button
    key={cat}
    onClick={() => setActiveCategory(cat)}
    className={`px-6 py-2 text-sm rounded-full transition-all ${
      activeCategory === cat
        ? 'bg-[#281000] text-white'
        : 'bg-white border border-gray-200 text-black'
    }`}
  >
    {cat}
  </button>
))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group    hover:shadow-xl transition-all duration-300">
              
              {/* Product Image */}
              <div className="relative h-[380px] overflow-hidden rounded-2xl">
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-3">{product.title}</h3>
                
                <p className="text-[14px] text-black/70 leading-relaxed line-clamp-3 mb-5">
                  {product.desc}
                </p>

                {/* Enquire Button */}
       <div className="flex items-center justify-between mt-5">
  <button className="px-6 py-2.5 border border-[#281000] text-[#281000] rounded-full text-sm font-medium hover:bg-[#281000] hover:text-white transition-all">
    Enquire →
  </button>

<div className="flex items-center gap-3">
  <button
    onClick={() =>
      setSelectedColors({
        ...selectedColors,
        [product.id]: 'teal',
      })
    }
    className={`w-4 h-4 rounded-full bg-teal-600 transition-all ${
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
    className={`w-4 h-4 rounded-full bg-blue-600 transition-all ${
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
    className={`w-4 h-4 rounded-full bg-rose-600 transition-all ${
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
    className={`w-4 h-4 rounded-full bg-slate-800 transition-all ${
      selectedColors[product.id] === 'black'
        ? 'ring-2 ring-slate-800 ring-offset-2 scale-125'
        : ''
    }`}
  />
</div>
</div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center mt-14">
         <Link
  href="/retail/new-arrival"
  className="px-10 py-4 bg-[#281000] hover:bg-[#281000] text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
>
  See All New Arrival →
</Link>
        </div>
      </div>
    </section>
  );
}