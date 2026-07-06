// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
  {
    id: 1,
    slug: 'canvas-tote-bag',
    category: 'Accessories',
    type: 'Bags',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Canvas Tote Bag',
    desc: 'Spacious design · Durable fabric · Stylish everyday accessory',
  },
  {
    id: 2,
    slug: 'travel-purse',
    category: 'Accessories',
    type: 'Purses',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Travel Purse',
    desc: 'Compact design · Premium finish · Everyday essential',
  },
  {
    id: 3,
    slug: 'toiletry-organizer',
    category: 'Accessories',
    type: 'Toiletry Bags',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Toiletry Organizer',
    desc: 'Water resistant · Multiple compartments · Travel friendly',
  },
  {
    id: 4,
    slug: 'printed-tote-bag',
    category: 'Accessories',
    type: 'Bags',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Printed Tote Bag',
    desc: 'Premium fabric · Lightweight · Export quality',
  },
  {
    id: 5,
    slug: 'leather-purse',
    category: 'Accessories',
    type: 'Purses',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Leather Purse',
    desc: 'Elegant finish · Durable material · Stylish look',
  },
  {
    id: 6,
    slug: 'travel-toiletry-bag',
    category: 'Accessories',
    type: 'Toiletry Bags',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Travel Toiletry Bag',
    desc: 'Large storage · Water resistant · Easy to carry',
  },
  {
    id: 7,
    slug: 'handcrafted-bag',
    category: 'Accessories',
    type: 'Bags',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Handcrafted Bag',
    desc: 'Artisan made · Spacious design · Premium quality',
  },
  {
    id: 8,
    slug: 'zipper-purse',
    category: 'Accessories',
    type: 'Purses',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Zipper Purse',
    desc: 'Secure closure · Compact design · Lightweight',
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
                       Accessories
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Bags', 'Purses', 'Toiletry Bags'].map((cat) => (
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