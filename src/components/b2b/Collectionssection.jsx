'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsSection() {
  return (
   <section className="w-full bg-[#FFFEF9] pt-10 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 sm:w-16 h-px bg-[#95565E]"></div>
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-[#95565E]">
              BROWSE BY CATEGORY
            </span>
          </div>

         <h2 className="text-2xl sm:text-4xl font-bold text-center text-black leading-tight">
            Shop Our Collections
          </h2>

          <Link
  href="#"
  style={{ color: '#95565E' }}
  className="text-xs sm:text-sm font-medium tracking-widest uppercase flex items-center gap-1"
>
  SEE ALL COLLECTIONS →
</Link>
        </div>

        {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Dresses */}
          <Link href="/dresses" className="group">
           <div className="relative overflow-hidden rounded-[24px] h-[220px] sm:h-[300px] md:h-[420px] lg:h-[460px] xl:h-[500px] mb-4 shadow-lg">
  <Image
    src="/b2b/home/dress1.png"
    alt="Dresses"
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />
</div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-black">
  Dresses
</h3>
              <p className="text-sm text-black/70">Maxi Dress | Midi Dress | Short Dress</p>
            </div>
          </Link>

          {/* Tops */}
          <Link href="/tops" className="group">
            <div className="relative overflow-hidden rounded-[24px] h-[220px] sm:h-[300px] md:h-[420px] lg:h-[460px] xl:h-[500px] mb-4 shadow-lg">
  <Image
    src="/b2b/home/dress2.png"
    alt="Tops"
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />
</div>
            <div className="text-center">
            <h3 className="text-[13px] sm:text-sm text-black/60 leading-relaxed">
  Tops</h3>
              <p className="text-sm text-black/70">Crop Tops | Shirts | T-Shirts</p>
            </div>
          </Link>

          {/* Bottom Wear */}
          <Link href="/bottom-wear" className="group">
            <div className="relative overflow-hidden rounded-[24px] h-[220px] sm:h-[300px] md:h-[420px] lg:h-[460px] xl:h-[500px] mb-4 shadow-lg">
  <Image
    src="/b2b/home/dress3.png"
    alt="Bottom Wear"
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
  />
</div>
            <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 text-black">
  Bottom Wear</h3>
              <p className="text-[13px] sm:text-sm text-black/60 leading-relaxed">Pants | Skirts | Shorts</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}