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

  const marqueeItems = [
    'Fashion with Passion',
    'Est. 1985 - Pushkar, Rajasthan',
    'Premium Rayon • Kosturi Silk • Cotton Blend',
    'Export-Quality Guaranteed',
    '200+ Skilled Professionals',
    'Low MOQ • Custom Orders',
    'Pan-India • Global Export',
  ];
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
      <div className="w-full bg-[#FFFEF9] flex flex-col">
        {/* Hero Image Section */}
        <div className="relative w-full h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          <Image
            src="/b2b/home/hero.png"
            alt="Your Trusted Manufacturing Partner"
            width={1920}
            height={1080}
            priority
            className="w-full h-full object-cover object-top"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Hero Content - Centered */}
         <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center translate-y-22 md:translate-y-28 lg:translate-y-40">
            {/* Badge */}
           <div >
              <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-[1px]">
  B2B - Wholesale & Export
</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight max-w-5xl">
              Your Trusted Manufacturing Partner
            </h1>

            {/* Subheading */}
         <p className="text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] text-white/90 mb-6 whitespace-nowrap">
  Custom manufacturing, private label, and export-grade bulk supply - backed by 38 years of Pushkar craftsmanship
</p>

            {/* CTA Button */}
            <Link
              href="#collections"
             className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-[#95565E] hover:bg-[#874C54] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg shadow-lg"
            >
              Explore Products ↓
            </Link>
          </div>
        </div>

       

        {/* Animated Marquee Strip */}
        <div className="w-full bg-[#F2E6E7] py-3 sm:py-4 overflow-hidden border-b-2 border-black/10">
          <div className="relative">
            {/* Marquee Content - Duplicated for seamless loop */}
            <div className="marquee-container">
              {marqueeItems.map((item, index) => (
                <div key={`first-${index}`} className="marquee-item">
                  {item}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {marqueeItems.map((item, index) => (
                <div key={`second-${index}`} className="marquee-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
         {/* Stats Section */}
       <div className="w-full bg-white/50 backdrop-blur-sm   py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">

      {/* Stat 1 */}
      <div className="flex flex-col items-center text-center py-6 md:border-r md:border-black/10">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
          {years}+
        </h3>
        <p className="text-xs sm:text-sm text-black/70 font-medium uppercase tracking-widest">
          Years of Legacy
        </p>
      </div>

      {/* Stat 2 */}
      <div className="flex flex-col items-center text-center py-6 md:border-r md:border-black/10">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
          {professionals}+
        </h3>
        <p className="text-xs sm:text-sm text-black/70 font-medium uppercase tracking-widest">
          Skilled Professionals
        </p>
      </div>

      {/* Stat 3 */}
      <div className="flex flex-col items-center text-center py-6 md:border-r md:border-black/10">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
          {countries}+
        </h3>
        <p className="text-xs sm:text-sm text-black/70 font-medium uppercase tracking-widest">
          Countries Served
        </p>
      </div>

      {/* Stat 4 */}
      <div className="flex flex-col items-center text-center py-6">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
          {quality}%
        </h3>
        <p className="text-xs sm:text-sm text-black/70 font-medium uppercase tracking-widest">
          Export-Grade Quality
        </p>
      </div>

    </div>
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

        /* Marquee Animation */
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee-container {
          display: flex;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
          white-space: nowrap;
          padding: 0 2rem;
          display: inline-flex;
          align-items: center;
          gap: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3f2a1e;
          letter-spacing: 0.05em;
        }

        .marquee-item::after {
          content: '•';
          margin-left: 2rem;
        }

        .marquee-item:nth-child(7)::after,
        .marquee-item:nth-child(14)::after {
          display: none;
        }

        /* Responsive Typography */
        @media (max-width: 640px) {
          h1 {
            line-height: 1.2;
          }

          .marquee-item {
            padding: 0 1.5rem;
            font-size: 0.75rem;
            gap: 1.5rem;
          }

          .marquee-item::after {
            margin-left: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}