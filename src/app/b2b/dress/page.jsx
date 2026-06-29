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
    type: 'Maxi Dress',
    img: '/b2b/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 2,
    slug: 'floral-summer-dress',
    category: 'Dresses',
    type: 'Midi Dress',
    img: '/b2b/home/8.png',
    title: 'Botanical Halter Maxi',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 3,
    slug: 'casual-printed-top',
    category: 'Dresses',
    type: 'Short Dress',
    img: '/b2b/home/9.png',
    title: 'Botanical Halter Maxi',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 4,
    slug: 'boho-crop-top',
    category: 'Dresses',
    type: 'Short Dress',
    img: '/b2b/home/10.png',
    title: 'Botanical Halter Maxi',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
  },

  {
    id: 5,
    slug: 'botanical-halter-maxi-2',
    category: 'Dresses',
    type: 'Maxi Dress',
    img: '/b2b/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 6,
    slug: 'floral-summer-dress-2',
    category: 'Dresses',
    type: 'Midi Dress',
    img: '/b2b/home/8.png',
    title: 'Botanical Halter Maxi',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 7,
    slug: 'casual-printed-top-2',
    category: 'Dresses',
    type: 'Short Dress',
    img: '/b2b/home/9.png',
    title: 'Botanical Halter Maxi',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 8,
    slug: 'boho-crop-top-2',
    category: 'Dresses',
    type: 'Short Dress',
    img: '/b2b/home/10.png',
    title: 'Botanical Halter Maxi',
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
        (product) => product.type === activeCategory
      );
    return (
     <section className="w-full bg-[#FFFEF9]">
   <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

                {/* Header */}
                <div className="mb-12">

                    {/* Heading */}
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#95565E]">
                        Dresses
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Maxi Dress', 'Midi Dress', 'Short Dress'].map((cat) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/b2b/product/${product.slug}`}
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
                                    <button className="px-6 py-2.5 border border-[#95565E] text-[#95565E] rounded-full text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all">
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


                
            </div>
        </section>
    );
}