// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';

const products = [
  {
    id: 1,
    slug: 'botanical-halter-maxi',
    category: 'Dresses',
    type: 'Pants',
    img: '/retail/home/7.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
  },
  {
    id: 2,
    slug: 'floral-summer-dress',
    category: 'Dresses',
    type: 'Skirts',
    img: '/retail/home/8.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
  },
  {
    id: 3,
    slug: 'casual-printed-top',
    category: 'Dresses',
    type: 'Shorts',
    img: '/retail/home/9.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
  },
  {
    id: 4,
    slug: 'boho-crop-top',
    category: 'Dresses',
    type: 'Shorts',
    img: '/retail/home/10.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
  },
];

export default function NewArrivalSection() {
  return (
    <section className="w-full bg-[#FFF7F2]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-medium text-[#281000]">
            Bottom Wear
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group block bg-[#FFF7F2] hover:shadow-xl transition-all duration-300"
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
                    <div className="w-4 h-4 rounded-full bg-teal-600" />
                    <div className="w-4 h-4 rounded-full bg-blue-600" />
                    <div className="w-4 h-4 rounded-full bg-rose-600" />
                    <div className="w-4 h-4 rounded-full bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}