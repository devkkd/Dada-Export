// components/LegacySection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LegacySection() {
  return (
  <section className="w-full bg-white py-10 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
         <div className="space-y-5 sm:space-y-8">
            <div>
              <span className="text-xs tracking-[2px] uppercase text-[#95565E] font-medium">
                OUR LEGACY
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#95565E] leading-tight mt-2">
                Family Craft, Global Standards
              </h2>
            </div>

            <div className="space-y-4 text-[14px] sm:text-[15.5px] leading-7 text-[#3F2A1E]/90">
              <p>
                Since 1985, Shri Ramnivas Rankawat began stitching from home in Pushkar, Rajasthan - laying the 
                foundation of what would become a garment legacy. In 1992, Rankawat Tailor Shop was established, 
                serving customers with quality tailoring and export-grade garments for over three decades.
              </p>
              <p>
                In 2023, his son launched Dada Exports - bringing that same 38-year expertise directly to Indian 
                buyers and global markets, eliminating middlemen and delivering real value at honest prices.
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pt-2">
             <div className="flex gap-3 sm:gap-6 items-stretch">
  <div className="w-14 sm:w-20 flex-shrink-0 pt-1">
    <span className="text-xl sm:text-3xl font-bold text-black">1985</span>
  </div>

  <div className="w-px self-stretch bg-[#D8D0D0]"></div>

  <p className="flex-1 text-[13px] sm:text-[15px] text-[#0E0E0E]/80 leading-6">
                  Shri Ramnivas Rankawat begins stitching from home in Pushkar, Rajasthan
                </p>
              </div>

             <div className="flex gap-3 sm:gap-6 items-stretch">
               <div className="w-14 sm:w-20 flex-shrink-0">
                 <span className="text-xl sm:text-3xl font-bold text-black">1992</span>
                </div>
                <div className="w-px h-14 bg-[#D8D0D0]"></div>
              <p className="text-[13px] sm:text-[15px] text-[#0E0E0E]/80 leading-6">
                  Rankawat Tailor Shop established - a trusted institution in Pushkar&apos;s garment industry
                </p>
              </div>

             <div className="flex gap-3 sm:gap-6 items-stretch">
              <div className="w-14 sm:w-20 flex-shrink-0">
                 <span className="text-xl sm:text-3xl font-bold text-black">2023</span>
                </div>
                <div className="w-px h-14 bg-[#D8D0D0]"></div>
               <p className="text-[13px] sm:text-[15px] text-[#0E0E0E]/80 leading-6">
                  Dada Exports launched - export-quality fashion direct to buyers across India and the world
                </p>
              </div>
            </div>

            {/* Button */}
            <Link
              href="/about"
             className="inline-block mt-4 sm:mt-6 px-6 sm:px-8 py-3 bg-[#95565E] hover:bg-[#8A4F57] text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              See Full Our Legacy →
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden rounded-[24px] shadow-2xl h-[260px] sm:h-[420px] lg:h-[620px]">
            <Image
              src="/b2b/home/6.png"
              alt="Dada Exports Store Interior"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}