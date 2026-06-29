// src/components/b2b/GlobalPresence.tsx
import Image from 'next/image';
import React from 'react';

const GlobalPresence = () => {
  return (
  <section
  className="w-full bg-[#FFFEF9]"
>
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[#8C5F3C]"></div>
              <span className="text-[#8C5F3C] uppercase tracking-widest text-sm font-medium">
                GLOBAL PRESENCE
              </span>
            </div>

    <h2 className="text-3xl md:text-4xl leading-tight tracking-tight text-[#0E0E0E] lg:whitespace-nowrap">
  <span className="font-normal">
    Exporting, Indian Craft
  </span>{' '}
  <span className="font-black">
    Worldwide
  </span>
</h2>
<div className="h-2"></div>

            <p className="text-[#0E0E0E] text-lg leading-relaxed max-w-lg ">
              Our garments are trusted by boutiques, retailers, and fashion brands 
              across four continents each piece carrying the spirit of Pushkar 
              craftsmanship.
            </p>
          </div>

          {/* Right - World Map */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[650px]">
              <Image
                src="/b2b/home/maps.png"
                alt="Global Export Map"
                width={700}
                height={420}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;