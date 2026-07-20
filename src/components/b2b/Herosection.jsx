"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [years, setYears] = useState(0);
  const [professionals, setProfessionals] = useState(0);
  const [countries, setCountries] = useState(0);
  const [quality, setQuality] = useState(0);

  const heroImages = [
    '/b2b/home/hero.png',
    '/b2b/home/hero.png',
    '/b2b/home/hero.png',
    '/b2b/home/hero.png',
  ];

  const [currentImage, setCurrentImage] = useState(0);
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
          }, 2500);
        }
      }, 30);
    };

    animateCounters();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full bg-[#FFFEF9] flex flex-col">
        {/* Hero Image Section */}
        <div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[40vh] lg:h-[80vh] overflow-hidden">

          <Image
            key={currentImage}
            src={heroImages[currentImage]}
            alt="Your Trusted Manufacturing Partner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-top transition-all duration-700"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Hero Content - Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 gap-2 translate-y-2 sm:translate-y-8 md:translate-y-20 lg:translate-y-40">
            {/* Badge */}
            <div>
              <span className="text-[10px] sm:text-[15px] md:text-xl font-semibold text-white tracking-[1px] uppercase">
                B2B - Wholesale & Export
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[18px] sm:text-[28px] md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-[92%] sm:max-w-4xl mb-2 sm:mb-5">
              Your Trusted Manufacturing Partner
            </h1>

            {/* Subheading */}
            <p className="text-[10px] sm:text-[13px] md:text-[15px] lg:text-[16px] text-white/90 leading-relaxed max-w-[92%] sm:max-w-3xl mb-3 sm:mb-6">
              Custom manufacturing, private label, and export-grade bulk supply - backed by 38 years of Pushkar craftsmanship
            </p>

            {/* CTA Button */}
            <Link href="#collections" className="inline-block px-5 sm:px-10 py-2.5 sm:py-4 bg-[#95565E] hover:bg-[#874C54] text-white font-semibold rounded-full transition-all duration-300 text-[12px] sm:text-base shadow-lg transform hover:scale-105 active:scale-95">
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
        <div className="w-full bg-white/50 backdrop-blur-sm py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-4 md:grid-cols-4 gap-0">
              {/* Stat 1 */}
             <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-black/10">
                <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-black mb-2">{years}+</h3>
                <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">Years of Legacy</p>
              </div>

              {/* Stat 2 */}
             <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-black/10">
           <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-black mb-2">{professionals}+</h3>
               <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">Skilled Professionals</p>
              </div>

              {/* Stat 3 */}
            <div className="flex flex-col items-center text-center py-3 sm:py-6 md:border-r md:border-black/10">
              <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-black mb-2">{countries}+</h3>
               <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto"> Served</p>
              </div>

              {/* Stat 4 */}
            <div className="flex flex-col items-center text-center py-3 sm:py-6">
                <h3 className="text-xl sm:text-3xl md:text-5xl font-bold text-black mb-2">{quality}%</h3>
              <p className="text-[8px] sm:text-sm md:text-sm text-black/70 font-medium uppercase tracking-wide text-center leading-tight w-[65px] sm:w-auto">Export-Grade Quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html {
          background-color: #fffef9;
          scroll-behavior: smooth;
        }

        body {
          background-color: #fffef9;
          font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * {
          box-sizing: border-box;
        }

        h1, h2, h3, h4, h5, h6, p {
          margin: 0;
          padding: 0;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .marquee-container {
          display: flex;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }

        .marquee-container:hover { animation-play-state: paused; }

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

        .marquee-item::after { content: "•"; margin-left: 2rem; }
        .marquee-item:nth-child(7)::after, .marquee-item:nth-child(14)::after { display: none; }

        @media (max-width: 640px) {
          h1 { line-height: 1.2; }
          .marquee-item { padding: 0 1.5rem; font-size: 0.75rem; gap: 1.5rem; }
          .marquee-item::after { margin-left: 1.5rem; }
        }
      `}</style>
    </>
  );
}