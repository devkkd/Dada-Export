// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
 /* {
    id: 1,
    slug: "kids-shirt",
    type: "Shirts",
    img: "/retail/kids/1.png",
    hoverImg: "/retail/kids/2.png",
    title: "Kids Cotton Shirt",
    desc: "Premium cotton fabric...",
  },
  {
    id: 2,
    slug: "kids-jeans",
    type: "Jeans",
    img: "/retail/kids/3.png",
    hoverImg: "/retail/kids/4.png",
    title: "Kids Denim Jeans",
    desc: "Comfort fit denim...",
  },*/
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
        <section className="w-full bg-[#FFF7F2]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
                {/* Header */}
                <div className="mb-12">

                    {/* Heading */}
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#281000]">
                        Kidd's Wear
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Jeans', 'Shirts', 'T-Shirts'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 text-sm rounded-full transition-all ${activeCategory === cat
                                        ? 'bg-[#281000] text-white'
                                        : 'bg-white border border-gray-200 text-black'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                </div>

               {/* Products Grid / Coming Soon */}

{filteredProducts.length === 0 ? (

  <div className="flex flex-col items-center justify-center py-28">

    <div className="w-[120px] h-[120px] rounded-full bg-[#F2E7DE] flex items-center justify-center mb-8">
      <span className="text-5xl">🚧</span>
    </div>

    <h2 className="text-[30px] md:text-[35px] font-semibold text-[black]">
      Coming Soon
    </h2>

    <p className="mt-4 text-[#6B6B6B] text-center text-lg max-w-[600px] leading-8">
      Our Kidd's Wear collection is currently under development.
      New products will be available very soon.
      Stay tuned!
    </p>

  </div>

) : (

<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">

    {filteredProducts.map((product) => (

      <Link
        key={product.id}
        href={`/retail/product/${product.slug}`}
        className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300"
      >

        {/* Product Image */}
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
      ? "opacity-0 scale-105"
      : "opacity-100"
  }`}
/>

  {/* Hover Image */}

 <Image
  src={product.hoverImg || product.img}
  alt={product.title}
  fill
  className={`object-cover transition-all duration-500 ${
    activeImage[product.id]
      ? "opacity-100 scale-105"
      : "opacity-0"
  }`}
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

  {/* Enquire Button */}
  <button className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#281000] text-[#281000] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#281000] hover:text-white transition-all">
    Enquire →
  </button>

</div>

        </div>

      </Link>

    ))}

  </div>

)}


                
            </div>
        </section>
    );
}