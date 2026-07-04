// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
 {
  id: 1,
  slug: 'classic-crop-top',
  category: 'Tops',
  type: 'Crop Tops',
  img: '/b2b/home/11.png',
  hoverImg: '/b2b/home/12.png',
  title: 'Classic Crop Top',
  desc: 'Comfort fit · Soft fabric · Stylish everyday wear',
},
{
  id: 2,
  slug: 'oversized-shirt',
  category: 'Tops',
  type: 'Shirts',
  img: '/b2b/home/12.png',
  hoverImg: '/b2b/home/11.png',
  title: 'Oversized Shirt',
  desc: 'Relaxed fit · Premium cotton · Modern silhouette',
},
{
  id: 3,
  slug: 'graphic-tshirt',
  category: 'Tops',
  type: 'T-Shirts',
  img: '/b2b/home/11.png',
  hoverImg: '/b2b/home/12.png',
  title: 'Graphic T-Shirt',
  desc: 'Breathable fabric · Casual style · Daily comfort',
},
{
  id: 4,
  slug: 'floral-crop-top',
  category: 'Tops',
  type: 'Crop Tops',
  img: '/b2b/home/12.png',
  hoverImg: '/b2b/home/11.png',
  title: 'Floral Crop Top',
  desc: 'Lightweight fabric · Trendy design · Summer wear',
},
{
  id: 5,
  slug: 'formal-shirt',
  category: 'Tops',
  type: 'Shirts',
  img: '/b2b/home/11.png',
  hoverImg: '/b2b/home/12.png',
  title: 'Formal Shirt',
  desc: 'Premium quality · Smart fit · Elegant finish',
},
{
  id: 6,
  slug: 'basic-tshirt',
  category: 'Tops',
  type: 'T-Shirts',
  img: '/b2b/home/12.png',
  hoverImg: '/b2b/home/11.png',
  title: 'Basic T-Shirt',
  desc: 'Soft cotton · Breathable · Everyday essential',
},
{
  id: 7,
  slug: 'printed-crop-top',
  category: 'Tops',
  type: 'Crop Tops',
  img: '/b2b/home/11.png',
  hoverImg: '/b2b/home/12.png',
  title: 'Printed Crop Top',
  desc: 'Premium fabric · Stylish print · Comfortable fit',
},
{
  id: 8,
  slug: 'casual-shirt',
  category: 'Tops',
  type: 'Shirts',
  img: '/b2b/home/12.png',
  hoverImg: '/b2b/home/11.png',
  title: 'Casual Shirt',
  desc: 'Relaxed silhouette · Lightweight material',
},
];
export default function NewArrivalSection() {
    const [activeImage, setActiveImage] = useState({});
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedColors, setSelectedColors] = useState({});
   const filteredProducts =
  activeCategory === 'All'
    ? products
    : products.filter(
        (product) => product.type === activeCategory
      );
    return (
        <section className="w-full bg-[#FFFEF9]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
                {/* Header */}
                <div className="mb-12">

                    {/* Heading */}
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#95565E]">
                        Tops
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Crop Tops', 'Shirts', 'T-Shirts'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 text-sm rounded-full transition-all ${activeCategory === cat
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
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/b2b/product/${product.slug}`}
                            className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300"
                        >

                            {/* Product Image */}
                        <div
  className="relative h-[220px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl"
  onMouseEnter={() =>
    setActiveImage((prev) => ({ ...prev, [product.id]: true }))
  }
  onMouseLeave={() =>
    setActiveImage((prev) => ({ ...prev, [product.id]: false }))
  }
  onTouchStart={() =>
    setActiveImage((prev) => ({ ...prev, [product.id]: true }))
  }
  onTouchEnd={() =>
    setActiveImage((prev) => ({ ...prev, [product.id]: false }))
  }
>
  {/* Main Image */}
  <Image
    src={product.img}
    alt={product.title}
    fill
    className={`object-cover transition-all duration-500 ${
      activeImage[product.id]
        ? 'opacity-0 scale-105'
        : 'opacity-100'
    }`}
  />

  {/* Hover Image */}
  <Image
    src={product.hoverImg}
    alt={product.title}
    fill
    className={`object-cover transition-all duration-500 ${
      activeImage[product.id]
        ? 'opacity-100 scale-105'
        : 'opacity-0'
    }`}
  />
</div>

                            {/* Content */}
                           <div className="p-3 sm:p-6">
                               <h3 className="text-[15px] sm:text-xl font-bold text-black mb-2 line-clamp-1">{product.title}</h3>

                               <p className="text-[11px] sm:text-[14px] text-black/70 leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">
                                    {product.desc}
                                </p>

                                {/* Enquire Button */}
                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">

  {/* Colors */}
  <div className="order-1 sm:order-2 flex items-center justify-center sm:justify-end gap-3">

    <button
      onClick={() =>
        setSelectedColors({
          ...selectedColors,
          [product.id]: 'teal',
        })
      }
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-teal-600 transition-all ${
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
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-600 transition-all ${
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
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-rose-600 transition-all ${
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
      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 transition-all ${
        selectedColors[product.id] === 'black'
          ? 'ring-2 ring-slate-800 ring-offset-2 scale-125'
          : ''
      }`}
    />

  </div>

  {/* Enquire Button */}
  <button className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#95565E] text-[#95565E] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all">
    Enquire →
  </button>

</div>
                            </div>
                        </Link>
                    ))}
                </div>


                
            </div>
        </section>
    );
}