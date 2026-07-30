'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useB2BData } from '@/components/b2b/B2BDataContext';

const PAGE_SIZE = 16;

export default function B2BSearchPage() {
  const searchParams = useSearchParams();
  const { allProducts } = useB2BData();

  const searchQuery = searchParams.get('q') || '';
  const [activeImage, setActiveImage] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [page, setPage] = useState(1);
  const [prevQuery, setPrevQuery] = useState(searchQuery);

  // Reset page pagination when query changes in render phase
  if (searchQuery !== prevQuery) {
    setPage(1);
    setPrevQuery(searchQuery);
  }

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase().trim();
    return (allProducts || []).filter((p) => {
      return (
        p.name?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower) ||
        p.sku?.toLowerCase().includes(lower) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lower)))
      );
    });
  }, [allProducts, searchQuery]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <section className="w-full bg-[#FFFEF9]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-[#95565E]">
            Search Results
          </h2>
          <p className="mt-3 text-lg text-black/60">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found for &ldquo;<span className="font-semibold text-black">{searchQuery}</span>&rdquo;
          </p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-gray-400 gap-4">
            <p className="text-xl text-[#281000]/70">No products found matching your search.</p>
            <p className="text-sm text-gray-400">Try checking spelling or searching for another keyword.</p>
            <Link href="/b2b" className="mt-4 px-6 py-2.5 bg-[#95565E] text-white rounded-full hover:bg-[#95565E]/90 transition-all font-medium text-sm">
              Back to Home
            </Link>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {paginated.map((product) => (
            <Link 
              key={product._id} 
              href={`/b2b/product/${product.slug}`}
              className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300"
            >
              <div
                className="relative h-[220px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl"
                onMouseEnter={() => setActiveImage((p) => ({ ...p, [product._id]: true }))}
                onMouseLeave={() => setActiveImage((p) => ({ ...p, [product._id]: false }))}
                onTouchStart={() => setActiveImage((p) => ({ ...p, [product._id]: true }))}
                onTouchEnd={() => setActiveImage((p) => ({ ...p, [product._id]: false }))}
              >
                <Image 
                  src={product.images?.[0] || '/b2b/home/7.png'} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 ${activeImage[product._id] ? 'opacity-0 scale-105' : 'opacity-100'}`} 
                />
                <Image 
                  src={product.images?.[1] || product.images?.[0] || '/b2b/home/8.png'} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-cover transition-all duration-500 ${activeImage[product._id] ? 'opacity-100 scale-105' : 'opacity-0'}`} 
                />
              </div>

              <div className="p-3 sm:p-6">
                <h3 className="text-[15px] sm:text-xl font-bold text-black mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-[11px] sm:text-[14px] text-black/70 leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">{product.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                  {product.colors?.length > 0 && (
                    <div className="order-1 sm:order-2 flex items-center justify-center sm:justify-end gap-3">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <button 
                          key={i} 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            setSelectedColors({ ...selectedColors, [product._id]: color.name }); 
                          }}
                          title={color.name}
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all ${selectedColors[product._id] === color.name ? 'ring-2 ring-offset-2 scale-125' : ''}`}
                          style={{ backgroundColor: color.hex || '#ccc' }} 
                        />
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#95565E] text-[#95565E] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all"
                  >
                    Enquire →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col items-center mt-20">
            <p className="text-[#0E0E0E] text-lg font-normal mb-4">Showing {paginated.length} of {filtered.length}</p>
            {hasMore && (
              <button 
                onClick={() => setPage((p) => p + 1)}
                className="w-[200px] h-[52px] rounded-full bg-[#E9DDE0] text-[#0E0E0E] text-[16px] font-medium transition-all duration-300 hover:bg-[#95565E] hover:text-white hover:scale-105"
              >
                SEE MORE
              </button>
            )}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-8 text-[#0E0E0E] text-[14px] font-medium tracking-tight hover:text-[#95565E] transition-colors"
            >
              ↑ BACK TO TOP
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
