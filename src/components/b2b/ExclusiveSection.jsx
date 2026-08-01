// components/ExclusiveSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ExclusiveSection() {
  return (
    <section className="w-full bg-[#FFFEF9] py-10 sm:py-20 md:py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        
        {/* Heading */}
        <h2 className="text-center text-[#95565E] text-[16px] sm:text-[26px] md:text-[28px] font-medium tracking-[6px] sm:tracking-[3px] uppercase mb-8 sm:mb-16">
          EXCLUSIVE TO BUSINESS PARTNERS
        </h2>
        <div className="hidden sm:block h-10"></div>

        {/* Two Column Grid — always 2 columns, even on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:gap-12">
          
          {/* Accessories Card */}
          <Link href="/accessories" className="group">
            <div className="relative overflow-hidden rounded-xl sm:rounded-3xl aspect-[16/9.8] mb-3 sm:mb-6 shadow-sm bg-[#f4f2ea]">
              <Image
                src="/b2b/home/4.png"
                alt="Accessories"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            
            {/* Content - Left Aligned */}
            <div className="text-left pl-1">
              <h3 className="text-sm sm:text-1xl md:text-2xl font-bold text-black mb-1 sm:mb-2">
                Accessories
              </h3>
              <p className="text-[11px] sm:text-[15px] text-black/70 font-medium leading-snug">
                Bags | Purses | Toiletry Bags
              </p>
            </div>
          </Link>

          {/* Home & Lifestyle Card */}
          <Link href="/home-lifestyle" className="group">
            <div className="relative overflow-hidden rounded-xl sm:rounded-3xl aspect-[16/9.8] mb-3 sm:mb-6 shadow-sm bg-[#f4f2ea]">
              <Image
                src="/b2b/home/5.png"
                alt="Home & Lifestyle"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            
            {/* Content - Left Aligned */}
            <div className="text-left pl-1">
              <h3 className="text-sm sm:text-1xl md:text-2xl font-bold text-black mb-1 sm:mb-2">
                Home &amp; Lifestyle
              </h3>
              <p className="text-[11px] sm:text-[15px] text-black/70 font-medium leading-snug">
                Yoga Mats | Sofa Covers
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}