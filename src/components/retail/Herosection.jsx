'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const [isHovered, setIsHovered] = useState(false);
    const [years, setYears] = useState(0);
    const [professionals, setProfessionals] = useState(0);
    const [countries, setCountries] = useState(0);
    const [quality, setQuality] = useState(0);

    useEffect(() => {
        const animateCounters = () => {
            let y = 0;
            let p = 0;
            let c = 0;
            let q = 0;

            const interval = setInterval(() => {
                if (y < 38) {
                    y++;
                    setYears(y);
                }

                if (p < 200) {
                    p += 5;
                    setProfessionals(p);
                }

                if (c < 15) {
                    c++;
                    setCountries(c);
                }

                if (q < 100) {
                    q += 2;
                    setQuality(q);
                }

                if (y >= 38 && p >= 200 && c >= 15 && q >= 100) {
                    clearInterval(interval);

                    setTimeout(() => {
                        setYears(0);
                        setProfessionals(0);
                        setCountries(0);
                        setQuality(0);

                        animateCounters();
                    }, 2500); // complete hone ke baad 2.5 sec rukega
                }
            }, 30);
        };

        animateCounters();
    }, []);

    return (
        <>
            <div className="w-full bg-[#FFF7F2] flex flex-col">
                {/* Hero Image Section */}
                <div className="relative w-full h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
                    <Image
                        src="/retail/home/1.png"
                        alt="Your Trusted Manufacturing Partner"
                        width={1920}
                        height={1080}
                        priority
                        className="w-full h-full object-cover object-top"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Hero Content - Centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center translate-y-18 md:translate-y-18 lg:translate-y-30">
                        {/* Badge */}
                        <div >
                            <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-[1px]">
                                B2C  - Retail & Customization
                            </span>
                        </div>

                        {/* Main Heading */}
                 <h1 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight tracking-tight lg:whitespace-nowrap">
  Elevated Everyday Fashion with Timeless Elegance and Grace made for you
</h1>

                        {/* Subheading */}
                        <p className="text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] text-white/90 mb-6 whitespace-nowrap">
                            And This Is The Meaning = Iveara Creates Refined, Sophisticated Fashion That Feels Elegant And Graceful For Everyday Wear Styles That Stay Beautiful Beyond Trends.
                        </p>

                        {/* CTA Button */}
                        <Link
                            href="#collections"
                            className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-[#281000] hover:bg-[#281000] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg shadow-lg"
                        >
                            Shop Collection ↓
                        </Link>
                    </div>
                </div>




                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 pt-12 pb-12">
  
  {/* Stat 1 */}
  <div className="flex flex-col items-center text-center md:border-r md:border-[#281000]/10">
    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#281000] mb-2">
      {years}+
    </h3>
    <p className="text-xs sm:text-sm text-black/70 font-medium">
      Years of Legacy
    </p>
  </div>

  {/* Stat 2 */}
  <div className="flex flex-col items-center text-center md:border-r md:border-[#281000]/10">
    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#281000] mb-2">
      {professionals}+
    </h3>
    <p className="text-xs sm:text-sm text-black/70 font-medium">
      Skilled Professionals
    </p>
  </div>

  {/* Stat 3 */}
  <div className="flex flex-col items-center text-center md:border-r md:border-[#281000]/10">
    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#281000] mb-2">
      {countries}+
    </h3>
    <p className="text-xs sm:text-sm text-black/70 font-medium">
      Countries Served
    </p>
  </div>

  {/* Stat 4 */}
  <div className="flex flex-col items-center text-center">
    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#281000] mb-2">
      {quality}%
    </h3>
    <p className="text-xs sm:text-sm text-black/70 font-medium">
      Export-Grade Quality
    </p>
  </div>

</div>
                {/* Brand Statement Section */}
<div className="w-full bg-[#FFF7F2] py-12 md:py-16">
  <div className="max-w-5xl mx-auto px-6 text-center">
    <p
      className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] italic font-normal leading-[160%] text-[#281000]"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      "We Don't Believe Good Clothing Should Only Be Available In International
      Markets. Indian Customers Deserve Export Quality Garments At Honest Prices."
    </p>
  </div>
</div>
            </div>

            {/* All CSS in one global style tag */}
            <style jsx global>{`
        html {
          background-color: #fffef9;
        }

        body {
          background-color: #fffef9;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * {
          box-sizing: border-box;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Remove default margins */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
          margin: 0;
          padding: 0;
        }

        /* Link styles */
        a {
          text-decoration: none;
          color: inherit;
        }

       
        }

        
        /* Responsive Typography */
        @media (max-width: 640px) {
          h1 {
            line-height: 1.2;
          }

         
        }
      `}</style>
        </>
    );
}