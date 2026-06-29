// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const products = [
    {
        id: 1,
        slug: 'botanical-halter-maxi',
        category: 'Dresses',
        img: '/retail/newArrivals/2.png',
        title: 'Botanical Halter Maxi',
        desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
    },
    {
        id: 2,
        slug: 'floral-summer-dress',
        category: 'Dresses',
        img: '/retail/newArrivals/1.png',
        title: 'Floral Summer Dress',
        desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
    },
    {
        id: 3,
        slug: 'casual-printed-top',
        category: 'Tops',
        img: '/retail/newArrivals/3.png',
        title: 'Casual Printed Top',
        desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
    },
    {
        id: 4,
        slug: 'boho-crop-top',
        category: 'Tops',
        img: '/retail/newArrivals/6.png',
        title: 'Boho Crop Top',
        desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
    },
    {
        id: 5,
        slug: 'wide-leg-pants',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/5.png',
        title: 'Wide Leg Pants',
        desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
    },
    {
        id: 6,
        slug: 'printed-palazzo',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/4.png',
        title: 'Printed Palazzo',
        desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
    },
     {
        id: 7,
        slug: 'wide-leg-pants',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/5.png',
        title: 'Wide Leg Pants',
        desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
    },
    {
        id: 8,
        slug: 'printed-palazzo',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/4.png',
        title: 'Printed Palazzo',
        desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
    },
    
    {
        id: 9,
        slug: 'botanical-halter-maxi-2',
        category: 'Dresses',
        img: '/retail/newArrivals/2.png',
        title: 'Botanical Halter Maxi',
        desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
    },
    {
        id: 10,
        slug: 'floral-summer-dress-2',
        category: 'Dresses',
        img: '/retail/newArrivals/1.png',
        title: 'Floral Summer Dress',
        desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
    },
    {
        id: 11,
        slug: 'casual-printed-top-2',
        category: 'Tops',
        img: '/retail/newArrivals/3.png',
        title: 'Casual Printed Top',
        desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
    },
    {
        id: 12,
        slug: 'boho-crop-top-2',
        category: 'Tops',
        img: '/retail/newArrivals/6.png',
        title: 'Boho Crop Top',
        desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
    },
    {
        id: 13,
        slug: 'wide-leg-pants-2',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/5.png',
        title: 'Wide Leg Pants',
        desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
    },
    {
        id: 14,
        slug: 'printed-palazzo-2',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/4.png',
        title: 'Printed Palazzo',
        desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
    },
    {
        id: 15,
        slug: 'wide-leg-pants-2',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/5.png',
        title: 'Wide Leg Pants',
        desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
    },
    {
        id: 16,
        slug: 'printed-palazzo-2',
        category: 'Bottom Wear',
        img: '/retail/newArrivals/4.png',
        title: 'Printed Palazzo',
        desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
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
      <section className="w-full bg-[#FFF7F2]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

                {/* Header */}
                <div className="mb-12">

                    {/* Heading */}
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#281000]">
                        New Arrival
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Dresses', 'Tops', 'Bottom Wear'].map((cat) => (
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

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/retail/product/${product.slug}`}
                            className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300"
                        >

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
                                            className={`w-4 h-4 rounded-full bg-teal-600 transition-all ${selectedColors[product.id] === 'teal'
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
                                            className={`w-4 h-4 rounded-full bg-blue-600 transition-all ${selectedColors[product.id] === 'blue'
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
                                            className={`w-4 h-4 rounded-full bg-rose-600 transition-all ${selectedColors[product.id] === 'rose'
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
                                            className={`w-4 h-4 rounded-full bg-slate-800 transition-all ${selectedColors[product.id] === 'black'
                                                    ? 'ring-2 ring-slate-800 ring-offset-2 scale-125'
                                                    : ''
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


                {/* Bottom Section */}
                <div className="flex flex-col items-center mt-20">

                    {/* Count */}
                    <p className="text-[#0E0E0E] text-lg font-normal mb-4">
                        Showing 1 - 15 of 356
                    </p>

                    {/* See More Button */}
                    <button
                        className="
      w-[200px]
      h-[52px]
      rounded-full
      bg-[#FEE6C3]
      text-[#0E0E0E]
      text-[16px]
      font-medium
      transition-all
      duration-300
      hover:bg-[#281000]
      hover:text-white
      hover:scale-105
    "
                    >
                        SEE MORE
                    </button>

                    {/* Back To Top */}
                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                        }
                        className="
      mt-8
      text-[#0E0E0E]
      text-[14px]
      font-medium
      tracking-tight
      hover:text-[#95565E]
      transition-colors
    "
                    >
                        ↑ BACK TO TOP
                    </button>

                </div>
            </div>
        </section>
    );
}