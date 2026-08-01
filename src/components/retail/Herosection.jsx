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

// Desktop images
const heroImages = [
  '/retail/home/ivera.png',
  '/retail/home/ivera2.png',
];

// Mobile images (change these paths later to your mobile-specific images)
const heroImagesMobile = [
  '/retail/home/ivera.png',
  '/retail/home/ivera2.png',
];

const [currentImage, setCurrentImage] = useState(0);
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
    useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  }, 2500); // 2.5 sec

  return () => clearInterval(interval);
}, []);

    return (
        <>
            <div className="w-full bg-[#FFF7F2] flex flex-col">
                {/* Hero Image Section */}
               <div className="relative w-full h-[70vh] sm:h-[40vh] md:h-[40vh] lg:h-[70vh] overflow-hidden">

  {/* Mobile Image */}
  <Image
    key={`mobile-${currentImage}`}
    src={heroImagesMobile[currentImage]}
    alt="Your Trusted Manufacturing Partner"
    fill
    priority
    sizes="100vw"
    className="
      block sm:hidden
      object-cover
      object-[center_15%]
      transition-all
      duration-500
    "
  />

  {/* Desktop Image */}
  <Image
    key={`desktop-${currentImage}`}
    src={heroImages[currentImage]}
    alt="Your Trusted Manufacturing Partner"
    fill
    priority
    sizes="100vw"
    className="
      hidden sm:block
      object-cover
      sm:object-cover
      md:object-top
      transition-all
      duration-500
    "
  />

                    {/* Dark Overlay */}
                    {/* <div className="absolute inset-0 bg-black/30"></div> */}

                    {/* Hero Content - Centered */}
                   {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 gap-2 translate-y-0 sm:translate-y-4 md:translate-y-12 lg:translate-y-32">
                        
                        <div >
                        <span className="text-[10px] sm:text-[15px] md:text-xl font-semibold text-white tracking-[1px] uppercase">
                                B2C  - Retail & Customization
                            </span>
                        </div>

                        
                <h1 className="text-[18px] sm:text-[28px] md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-[92%] sm:max-w-5xl mb-2 sm:mb-5">
  Elevated Everyday Fashion with Timeless Elegance and Grace made for you
</h1>

                     
                      <p className="text-[10px] sm:text-[13px] md:text-[15px] lg:text-[16px] text-white/90 leading-relaxed max-w-[92%] sm:max-w-4xl mb-3 sm:mb-6">
                            And This Is The Meaning = Iveara Creates Refined, Sophisticated Fashion That Feels Elegant And Graceful For Everyday Wear Styles That Stay Beautiful Beyond Trends.
                        </p>

                 
                        <Link
                            href="/retail/new-arrival"
                            style={{ color: '#ffffff' }}
                            className="inline-block px-5 sm:px-10 py-2.5 sm:py-4 bg-[#281000] hover:bg-[#1E0C00] !text-white font-semibold rounded-full transition-all duration-300 text-[12px] sm:text-base shadow-lg transform hover:scale-105 active:scale-95"
                        >
                            Shop Collection ↓
                        </Link>
                    </div> */}
                </div>




                {/* Stats Section */}
        {/* Stats Section */}
<div className="w-full bg-white/50 backdrop-blur-sm py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-4 gap-0">

      {/* Stat 1 */}
      <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-[#281000]/10">
        <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-[#281000] mb-2">
          {years}+
        </h3>

        <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">
          Years of Legacy
        </p>
      </div>

      {/* Stat 2 */}
      <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-[#281000]/10">
        <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-[#281000] mb-2">
          {professionals}+
        </h3>

        <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">
          Skilled Professionals
        </p>
      </div>

      {/* Stat 3 */}
      <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-[#281000]/10">
        <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-[#281000] mb-2">
          {countries}+
        </h3>

        <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">
          Countries Served
        </p>
      </div>

      {/* Stat 4 */}
      <div className="flex flex-col items-center text-center py-3 sm:py-6">
        <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-[#281000] mb-2">
          {quality}%
        </h3>

        <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">
          Export-Grade Quality
        </p>
      </div>

    </div>
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