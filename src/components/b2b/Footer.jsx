'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [categories, setCategories] = useState([]);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    fetch('/api/categories?site=b2b')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) setCategories(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#F9F4E1] text-[#3F2A1E] pt-8 lg:pt-14 pb-4 lg:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Top: Logo + Tagline ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 pb-8 lg:pb-10">
          <div className="lg:w-[220px] flex-shrink-0">
            <Image
              src="/b2b/footerlogo.png"
              alt="DADA EXPORTS"
              width={200} height={200}
              className="w-[140px] sm:w-[180px] lg:w-[200px] h-auto object-contain"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] lg:text-[22px] font-bold mb-2 tracking-tight">DADA EXPORTS</h2>
            <p className="text-[12.5px] lg:text-[14px] leading-6 text-[#3F2A1E]/75 max-w-xl">
              38+ Years of Thread &amp; Trust · Pushkar, India. A family-backed garment manufacturer
              and exporter delivering export-quality apparel to wholesale buyers and international
              importers since 1992.
            </p>
          </div>
        </div>

        <div className="relative left-1/2 -translate-x-1/2 w-screen border-b border-[#3F2A1E]/10" />

        {/* ── Main Links Grid ── */}
        <div className="pt-8 lg:pt-10 flex flex-col lg:flex-row gap-10 lg:gap-6">

          {/* ── Collections block ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile accordion header */}
            <button
              onClick={() => toggleSection('collections')}
              className="lg:hidden w-full flex items-center justify-between py-3 border-b border-[#3F2A1E]/10 mb-1"
            >
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/60">
                Collections
              </span>
              <span className="text-lg leading-none">{openSection === 'collections' ? '−' : '+'}</span>
            </button>

            {/* Desktop heading */}
            <p className="hidden lg:block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/50 mb-5">
              Collections
            </p>

            {/* Category grid — each category is a mini-column */}
            <div className={`${openSection === 'collections' ? 'block py-4' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6">
                {categories.map((cat) => (
                  <div key={cat._id}>
                    <Link
                      href={`/b2b/category/${cat.slug}`}
                      className="block text-[12px] font-semibold text-[#3F2A1E] mb-2 hover:opacity-70 transition-opacity"
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories?.length > 0 && (
                      <ul className="space-y-1.5">
                        {cat.subcategories.map((sub) => (
                          <li key={sub._id}>
                            <Link
                              href={`/b2b/category/${cat.slug}?sub=${sub.slug}`}
                              className="text-[11.5px] text-[#3F2A1E]/65 hover:text-[#3F2A1E] transition-colors"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Divider (desktop only) ── */}
          <div className="hidden lg:block w-px bg-[#3F2A1E]/10 self-stretch mx-2" />

          {/* ── Company + Contact ── */}
          <div className="lg:w-[280px] flex-shrink-0 flex flex-col sm:flex-row lg:flex-row gap-8 lg:gap-10">
            {/* Company */}
            <div className="flex-1">
              <button
                onClick={() => toggleSection('company')}
                className="lg:hidden w-full flex items-center justify-between py-3 border-b border-[#3F2A1E]/10 mb-1"
              >
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/60">Company</span>
                <span className="text-lg leading-none">{openSection === 'company' ? '−' : '+'}</span>
              </button>
              <p className="hidden lg:block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/50 mb-5">
                Company
              </p>
              <ul className={`space-y-2.5 text-[12px] ${openSection === 'company' ? 'block py-3' : 'hidden'} lg:block`}>
                {[
                  { label: 'About Us',           href: '/b2b/about' },
                  { label: 'Why Choose Us',       href: '/b2b/about' },
                  { label: 'Our Process',         href: '/b2b/process' },
                  { label: 'Wholesale Enquiry',   href: '/b2b/wholesaleenquary' },
                  { label: 'Privacy Policy',      href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#3F2A1E]/70 hover:text-[#3F2A1E] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex-1">
              <button
                onClick={() => toggleSection('contact')}
                className="lg:hidden w-full flex items-center justify-between py-3 border-b border-[#3F2A1E]/10 mb-1"
              >
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/60">Contact</span>
                <span className="text-lg leading-none">{openSection === 'contact' ? '−' : '+'}</span>
              </button>
              <p className="hidden lg:block text-[11px] font-semibold tracking-[0.15em] uppercase text-[#3F2A1E]/50 mb-5">
                Contact
              </p>
              <ul className={`space-y-2.5 text-[12px] ${openSection === 'contact' ? 'block py-3' : 'hidden'} lg:block`}>
                <li className="text-[#3F2A1E]/70">Pushkar, Rajasthan, India</li>
                <li>
                  <a href="tel:+918209934610" className="text-[#3F2A1E]/70 hover:text-[#3F2A1E] transition-colors">
                    +91 8209934610
                  </a>
                </li>
                <li>
                  <a href="mailto:dada.exports@gmail.com" className="text-[#3F2A1E]/70 hover:text-[#3F2A1E] transition-colors">
                    dada.exports@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-5 border-t border-[#3F2A1E]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11.5px] text-[#3F2A1E]/55 text-center md:text-left">
            © 2025 Dada Exports, Pushkar. All Rights Reserved. Est. 1992 · Family Craft Since 1992.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11.5px] text-[#3F2A1E]/55 font-medium">Follow us</span>
            <Link href="https://www.instagram.com/dada_exports" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <Image src="/instagram-logo-vector-illustrati 2-2.png" alt="Instagram" width={24} height={24} className="w-5 h-5 lg:w-6 lg:h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="#" target="_blank" className="hover:scale-110 transition-transform">
              <Image src="/g21.png" alt="Facebook" width={24} height={24} className="w-5 h-5 lg:w-6 lg:h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* ── Crafted By ── */}
        <div className="mt-4 flex justify-center">
          <a href="https://www.kontentkraftdigital.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
           {/*  <Image src="/k.png" alt="Kontent Kraft Digital" width={14} height={14} className="w-3.5 h-3.5 object-contain" /> */}
            <p className="text-[11px] text-[#3F2A1E]/45">
              Crafted by <span className="font-semibold text-[#3F2A1E]/65">Kontent Kraft Digital</span>
            </p>
          </a>
        </div>

      </div>
    </footer>
  );
}
