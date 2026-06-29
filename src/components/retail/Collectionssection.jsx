'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsSection() {
  return (
    <section className="w-full bg-[#FFF7F2] pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 sm:w-16 h-px bg-[#281000]"></div>
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-[#281000]">
              BROWSE BY CATEGORY
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-center text-black">
            Shop Our Collections
          </h2>

          <Link
  href="#"
  style={{ color: '#281000' }}
  className="text-xs sm:text-sm font-medium tracking-widest uppercase flex items-center gap-1"
>
  SEE ALL COLLECTIONS →
</Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Dresses */}
          <Link href="/dresses" className="group">
           <div className="relative overflow-hidden rounded-3xl h-[320px] sm:h-[380px] md:h-[480px] mb-5">
              <Image
                src="/retail/home/4.png"
                alt="Dresses"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
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
            <div className="relative overflow-hidden rounded-3xl h-[320px] sm:h-[380px] md:h-[480px] mb-5">
              <Image
                src="/retail/home/5.png"
                alt="Tops"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="text-center">
             <h3 className="text-2xl font-bold mb-2 text-black">
  Tops</h3>
              <p className="text-sm text-black/70">Crop Tops | Shirts | T-Shirts</p>
            </div>
          </Link>

          {/* Bottom Wear */}
          <Link href="/bottom-wear" className="group">
            <div className="relative overflow-hidden rounded-3xl h-[320px] sm:h-[380px] md:h-[480px] mb-5">
              <Image
                src="/retail/home/6.png"
                alt="Bottom Wear"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="text-center">
            <h3 className="text-2xl font-bold mb-2 text-black">
  Bottom Wear</h3>
              <p className="text-sm text-black/70">Pants | Skirts | Shorts</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}