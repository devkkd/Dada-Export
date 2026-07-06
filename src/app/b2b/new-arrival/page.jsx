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
    img: '/b2b/home/7.png',
    hoverImg: '/b2b/home/8.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 2,
    slug: 'floral-summer-dress',
    category: 'Dresses',
    img: '/b2b/home/8.png',
    hoverImg: '/b2b/home/7.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 3,
    slug: 'casual-printed-top',
    category: 'Tops',
    img: '/b2b/home/9.png',
    hoverImg: '/b2b/home/10.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 4,
    slug: 'boho-crop-top',
    category: 'Tops',
    img: '/b2b/home/10.png',
    hoverImg: '/b2b/home/9.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
  },
  {
    id: 5,
    slug: 'wide-leg-pants',
    category: 'Bottom Wear',
    img: '/b2b/home/11.png',
    hoverImg: '/b2b/home/12.png',
    title: 'Wide Leg Pants',
    desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
  },
  {
    id: 6,
    slug: 'printed-palazzo',
    category: 'Bottom Wear',
    img: '/b2b/home/12.png',
    hoverImg: '/b2b/home/11.png',
    title: 'Printed Palazzo',
    desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
  },
  {
    id: 7,
    slug: 'handcrafted-tote-bag',
    category: 'Accessories',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Handcrafted Tote Bag',
    desc: 'Spacious design · Durable fabric · Stylish everyday accessory',
  },
  {
    id: 8,
    slug: 'premium-yoga-mat',
    category: 'Home & Lifestyle',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Premium Yoga Mat',
    desc: 'Eco-friendly material · Comfortable grip · Lightweight and durable',
  },
  {
    id: 9,
    slug: 'botanical-halter-maxi-2',
    category: 'Dresses',
    img: '/b2b/home/8.png',
    hoverImg: '/b2b/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 10,
    slug: 'floral-summer-dress-2',
    category: 'Dresses',
    img: '/b2b/home/7.png',
    hoverImg: '/b2b/home/8.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 11,
    slug: 'casual-printed-top-2',
    category: 'Tops',
    img: '/b2b/home/10.png',
    hoverImg: '/b2b/home/9.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 12,
    slug: 'boho-crop-top-2',
    category: 'Tops',
    img: '/b2b/home/9.png',
    hoverImg: '/b2b/home/10.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
  },
  {
    id: 13,
    slug: 'wide-leg-pants-2',
    category: 'Bottom Wear',
    img: '/b2b/home/12.png',
    hoverImg: '/b2b/home/11.png',
    title: 'Wide Leg Pants',
    desc: 'Comfort fit · Elastic waistband · Premium fabric · Daily wear',
  },
  {
    id: 14,
    slug: 'printed-palazzo-2',
    category: 'Bottom Wear',
    img: '/b2b/home/11.png',
    hoverImg: '/b2b/home/12.png',
    title: 'Printed Palazzo',
    desc: 'Flowy silhouette · Breathable rayon · Elegant and comfortable',
  },
  {
    id: 15,
    slug: 'handcrafted-tote-bag-2',
    category: 'Accessories',
    img: '/b2b/home/14.png',
    hoverImg: '/b2b/home/13.png',
    title: 'Handcrafted Tote Bag',
    desc: 'Spacious design · Durable fabric · Stylish everyday accessory',
  },
  {
    id: 16,
    slug: 'premium-yoga-mat-2',
    category: 'Home & Lifestyle',
    img: '/b2b/home/13.png',
    hoverImg: '/b2b/home/14.png',
    title: 'Premium Yoga Mat',
    desc: 'Eco-friendly material · Comfortable grip · Lightweight and durable',
  },
];
export default function NewArrivalSection() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedColors, setSelectedColors] = useState({});
    const [activeImage, setActiveImage] = useState({});
    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter(
                (product) => product.category === activeCategory
            );
    return (
      <section className="w-full bg-[#FFFEF9]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

                {/* Header */}
                <div className="mb-12">

                    {/* Heading */}
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#95565E]">
                        New Arrival
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {['All', 'Dresses', 'Tops', 'Bottom Wear', 'Accessories', 'Home & Lifestyle'].map((cat) => (
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
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
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
                                <h3 className="text-[15px] sm:text-xl font-bold text-black mb-2 line-clamp-1">{product.title}</h3>

                             <p className="text-[11px] sm:text-[14px] text-black/70 leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">
                                    {product.desc}
                                </p>

                                {/* Enquire Button */}
                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">

  {/* Colors - Mobile Top */}
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

  {/* Button - Mobile Bottom */}
  <button className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#95565E] text-[#95565E] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all">
    Enquire →
  </button>

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
                        className="w-[200px] h-[52px] rounded-full bg-[#E9DDE0] text-[#0E0E0E] text-[16px] font-medium transition-all duration-300 hover:bg-[#95565E] hover:text-white hover:scale-105"
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
                        className="mt-8 text-[#0E0E0E] text-[14px] font-medium tracking-tight hover:text-[#95565E] transition-colors"
                    >
                        ↑ BACK TO TOP
                    </button>

                </div>
            </div>
        </section>
    );
}