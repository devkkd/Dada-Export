'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

const toggleSection = (section) => {
  setOpenSection(openSection === section ? null : section);
};
  return (
    <footer className="bg-[#FEE6C3] text-[#0E0E0E] pt-5 lg:pt-12 pb-4 lg:pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section - Logo + Description */}
       <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 pb-5 lg:pb-10">
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Image
                src="/retail/footerlogo.png"
                alt="DADA EXPORTS"
                width={200}
                height={200}
               className="w-[140px] sm:w-[180px] lg:w-[200px] h-auto object-contain"
                priority
              />
             
            </div>
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-[20px] lg:text-[24px] font-bold mb-2 tracking-tight">DADA EXPORTS</h2>
            <p className="text-[15.5px] leading-[1.65] text-[#3F2A1E]/90">
              38+ YEARS OF THREAD &amp; TRUST • PUSHKAR, INDIA. A FAMILY-BACKED GARMENT MANUFACTURER 
              AND EXPORTER FROM PUSHKAR, RAJASTHAN - DELIVERING EXPORT-QUALITY APPAREL TO WHOLESALE 
              BUYERS, RETAILERS, AND INTERNATIONAL IMPORTERS SINCE 1992.
            </p>
          </div>
        </div>
<div className="relative left-1/2 -translate-x-1/2 w-screen border-b border-[#3F2A1E]/10"></div>
        {/* Main Footer Links */}
      <div className="pt-4 lg:pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-y-6 lg:gap-y-10 gap-x-10">

  {/* EXCLUSIVE TO BUSINESS PARTNERS */}
 <div>
  <button
    onClick={() => toggleSection('business')}
    className="lg:hidden w-full flex items-center justify-between py-2.5 border-b border-[#3F2A1E]/10"
  >
    <span className="font-medium text-black">
      EXCLUSIVE TO BUSINESS PARTNERS
    </span>

    <span>{openSection === 'business' ? '−' : '+'}</span>
  </button>

  <div
    className={`${
      openSection === 'business'
        ? 'block py-2'
        : 'hidden'
    } lg:block`}
  >
    <h4 className="hidden lg:block text-[16px] tracking-wider mb-5">
      EXCLUSIVE TO BUSINESS PARTNERS
    </h4>

    <div className="grid grid-cols-2 gap-x-8 text-[12px]">
     <div className="grid grid-cols-2 gap-x-8 text-[12px]">
  <ul className="space-y-[10px]">
    <li><Link href="#">Accessories</Link></li>
    <li><Link href="#">Bags</Link></li>
    <li><Link href="#">Purses</Link></li>
    <li><Link href="#">Toiletry Bags</Link></li>
  </ul>

  <ul className="space-y-[10px]">
    <li><Link href="#">Home & Lifestyle</Link></li>
    <li><Link href="#">Yoga Mats</Link></li>
    <li><Link href="#">Sofa Covers</Link></li>
  </ul>
</div>
    </div>
  </div>
</div>

  {/* Dresses */}
 <div>
  <button
    onClick={() => toggleSection('dresses')}
    className="lg:hidden w-full flex justify-between items-center py-2.5 border-b border-[#3F2A1E]/10"
  >
    <span className="font-medium text-black">Dresses</span>

    <span>{openSection === 'dresses' ? '−' : '+'}</span>
  </button>

  <ul
    className={`text-[12px] space-y-[10px] ${
      openSection === 'dresses'
        ? 'block py-2'
        : 'hidden'
    } lg:block`}
  >
    <li className="hidden lg:block font-medium text-black mb-2">
      Dresses
    </li>

    <li><Link href="#">Maxi Dress</Link></li>
    <li><Link href="#">Midi Dress</Link></li>
    <li><Link href="#">Short Dress</Link></li>
  </ul>
</div>

  {/* Tops */}
 <div>
  <button
    onClick={() => toggleSection('tops')}
    className="lg:hidden w-full flex justify-between items-center py-2.5 border-b border-[#3F2A1E]/10"
  >
    <span className="font-medium text-black">Tops</span>

    <span>{openSection === 'tops' ? '−' : '+'}</span>
  </button>

  <ul
    className={`text-[12px] space-y-[10px] ${
      openSection === 'tops'
        ? 'block py-2'
        : 'hidden'
    } lg:block`}
  >
    <li className="hidden lg:block font-medium text-black mb-2">
      Tops
    </li>

    <li><Link href="#">Crop Tops</Link></li>
    <li><Link href="#">Shirts</Link></li>
    <li><Link href="#">T-Shirts</Link></li>
  </ul>
</div>

  {/* Bottom Wear */}
 <div>
  <button
    onClick={() => toggleSection('bottom')}
    className="lg:hidden w-full flex justify-between items-center py-2.5 border-b border-[#3F2A1E]/10"
  >
    <span className="font-medium text-black">
      Bottom Wear
    </span>

    <span>{openSection === 'bottom' ? '−' : '+'}</span>
  </button>

  <ul
    className={`text-[12px] space-y-[10px] ${
      openSection === 'bottom'
        ? 'block py-2'
        : 'hidden'
    } lg:block`}
  >
    <li className="hidden lg:block font-medium text-black mb-2">
      Bottom Wear
    </li>

    <li><Link href="#">Pants</Link></li>
    <li><Link href="#">Skirts</Link></li>
    <li><Link href="#">Shorts</Link></li>
  </ul>
</div>

  {/* Company + Contact */}
  <div>
  <button
    onClick={() => toggleSection('company')}
    className="lg:hidden w-full flex justify-between items-center py-2.5 border-b border-[#3F2A1E]/10"
  >
    <span className="font-medium text-black">
      Company & Contact
    </span>

    <span>{openSection === 'company' ? '−' : '+'}</span>
  </button>

  <div
    className={`${
      openSection === 'company'
        ? 'block py-2'
        : 'hidden'
    } lg:flex lg:flex-row gap-10 lg:gap-16`}
  >
    <div>
      <ul className="space-y-[10px] text-[12px]">
        <li className="hidden lg:block font-medium text-black mb-2">
          Company
        </li>

        <li><Link href="#">About Us</Link></li>
        <li><Link href="#">Our Legacy & Story</Link></li>
        <li><Link href="#">Why Choose</Link></li>
        <li><Link href="#">Process</Link></li>
        <li><Link href="#">Wholesale Enquiry</Link></li>
        <li><Link href="#">Privacy Policy</Link></li>
      </ul>
    </div>

    <div className="mt-5 lg:mt-0">
      <ul className="space-y-[10px] text-[12px]">
        <li className="hidden lg:block font-medium text-black mb-2">
          Contact
        </li>

        <li>Pushkar, Rajasthan, India</li>
        <li>+91 8209934610</li>

        <li>
          <a
            href="mailto:dada.exports@gmail.com"
            className="hover:underline"
          >
            dada.exports@gmail.com
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

</div>
<div className="hidden sm:block mt-3 relative left-1/2 -translate-x-1/2 w-screen border-b border-[#3F2A1E]/10"></div>
        {/* Bottom Bar */}
       <div className="mt-3 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] lg:text-[14px]">
            
          <div className="text-center md:text-left">
            © 2025 Dada Exports, Pushkar. All Rights Reserved. Est. 2023 • Family Craft Since 1992.
          </div>
          
         <div className="flex items-center gap-3">
            <span className="font-medium">Follow us</span>
            
          <Link
  href="https://www.instagram.com/ivearaa?igsh=MWZmdzAwdTR5ZHR6Nw=="
  target="_blank"
  rel="noopener noreferrer"
  className="hover:scale-110 transition-transform"
>
  <Image
    src="/instagram-logo-vector-illustrati 2-2.png"
    alt="Instagram"
    width={28}
    height={28}
    className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
  />
</Link>
            
            <Link href="#" target="_blank" className="hover:scale-110 transition-transform">
              <Image
                src="/g21.png"
                alt="Facebook"
               width={28}
height={28}
className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
              />
            </Link>
          </div>
        </div>
        {/* Crafted By */}
<div className="mt-2 lg:mt-4 flex justify-center">
  <a
    href="https://www.kontentkraftdigital.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
  >
    <Image
      src="/k.png"
      alt="Kontent Kraft Digital"
      width={18}
      height={18}
      className="w-4 h-4 object-contain"
    />

    <p className="text-[12px] lg:text-[15px] text-[#5A5A5A]">
      Crafted by{" "}
      <span className="font-semibold text-[#1F2937]">
        Kontent Kraft Digital
      </span>
    </p>
  </a>
</div>
      </div>
    </footer>
  );
}