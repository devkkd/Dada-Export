// components/ExclusiveSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ExclusiveSection() {
  return (
    <section className="w-full bg-[#FFFEF9] py-16 sm:py-20 md:py-24">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24">
        
        {/* Heading */}
        <h2 className="text-center text-[#95565E] text-[22px] sm:text-[26px] md:text-[28px] font-medium tracking-[3px] uppercase mb-16">
          EXCLUSIVE TO BUSINESS PARTNERS
        </h2>
<div className="h-10"></div>
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Accessories Card */}
          <Link href="/accessories" className="group">
            <div className="relative overflow-hidden rounded-3xl aspect-[16/9.8] mb-6 shadow-sm">
              <Image
                src="/b2b/home/4.png"
                alt="Accessories"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            
            {/* Content - Left Aligned */}
            <div className="text-left pl-1">
              <h3 className="text-1xl md:text-2xl font-bold text-black mb-2">
                Accessories
              </h3>
              <p className="text-[15px] text-black/70 font-medium">
                Bags | Purses | Toiletry Bags
              </p>
            </div>
          </Link>

          {/* Home & Lifestyle Card */}
          <Link href="/home-lifestyle" className="group">
            <div className="relative overflow-hidden rounded-3xl aspect-[16/9.8] mb-6 shadow-sm">
              <Image
                src="/b2b/home/5.png"
                alt="Home & Lifestyle"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            
            {/* Content - Left Aligned */}
            <div className="text-left pl-1">
              <h3 className="text-1xl md:text-2xl font-bold text-black mb-2">
                Home &amp; Lifestyle
              </h3>
              <p className="text-[15px] text-black/70 font-medium">
                Yoga Mats | Sofa Covers
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}