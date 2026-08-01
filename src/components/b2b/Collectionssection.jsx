'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useB2BData } from '@/components/b2b/B2BDataContext';

// Fallback images if category has no image
const FALLBACK_IMAGES = ['/b2b/home/dress1.png', '/b2b/home/dress2.png', '/b2b/home/dress3.png'];

export default function CollectionsSection() {
  const { categories } = useB2BData();

  // Top-level categories only, max 6 for the grid
  const topLevel = categories.filter((c) => !c.parentId).slice(0, 6);

  return (
    <section className="w-full bg-[#FFFEF9] pt-10 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

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
          <Link href="b2b/new-arrival" style={{ color: '#95565E' }} className="text-xs sm:text-sm font-medium tracking-widest uppercase flex items-center gap-1">
            SEE ALL COLLECTIONS →
          </Link>
        </div>

        {/* Collections Grid — 2 cols on mobile, 3 on desktop */}
        {topLevel.length === 0 ? (
          // Fallback to static while DB is empty
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {[
              { name: 'Dresses', img: '/b2b/home/dress1.png', sub: 'Maxi Dress | Midi Dress | Short Dress', slug: 'dresses' },
              { name: 'Tops',    img: '/b2b/home/dress2.png', sub: 'Crop Tops | Shirts | T-Shirts',          slug: 'tops'    },
              { name: 'Bottom Wear', img: '/b2b/home/dress3.png', sub: 'Pants | Skirts | Shorts',           slug: 'bottom-wear' },
            ].map((item) => (
              <Link key={item.slug} href={`/b2b/category/${item.slug}`} className="group">
                <div className="relative overflow-hidden rounded-[14px] sm:rounded-[24px] h-[160px] sm:h-[300px] md:h-[420px] lg:h-[460px] xl:h-[500px] mb-2 sm:mb-4 shadow-lg bg-[#f4f2ea]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain sm:object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm sm:text-2xl font-bold mb-1 sm:mb-2 text-black">{item.name}</h3>
                  <p className="text-[11px] sm:text-sm text-black/70 leading-snug">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {topLevel.map((cat, idx) => {
              const subNames = (cat.subcategories || []).map((s) => s.name).join(' | ');
              const imgSrc = cat.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

              return (
                <Link key={cat._id} href={`/b2b/category/${cat.slug}`} className="group">
                  <div className="relative overflow-hidden rounded-[14px] sm:rounded-[24px] h-[160px] sm:h-[300px] md:h-[420px] lg:h-[460px] xl:h-[500px] mb-2 sm:mb-4 shadow-lg bg-[#f4f2ea]">
                    <Image
                      src={imgSrc}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-contain sm:object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm sm:text-2xl font-bold mb-1 sm:mb-2 text-black">{cat.name}</h3>
                    {subNames && <p className="text-[11px] sm:text-sm text-black/70 leading-snug">{subNames}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}