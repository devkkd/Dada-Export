// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRetailData } from '@/components/retail/RetailDataContext';

const PAGE_SIZE = 16;

export default function NewArrivalSection() {
    const { newArrivals, categories } = useRetailData();
    const [activeImage, setActiveImage]       = useState({});
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedColors, setSelectedColors] = useState({});
    const [page, setPage]                     = useState(1);

    const categoryTabs = ['All', ...categories.filter((c) => !c.parentId).map((c) => c.name)];

    const filteredProducts =
        activeCategory === 'All'
            ? newArrivals
            : newArrivals.filter((product) => {
                const cat = categories.find((c) => String(c._id) === String(product.category));
                return cat?.name === activeCategory;
            });

    const paginated = filteredProducts.slice(0, page * PAGE_SIZE);
    const hasMore   = paginated.length < filteredProducts.length;

    const handleCategoryChange = (cat) => { setActiveCategory(cat); setPage(1); };

    return (
      <section className="w-full bg-[#FFF7F2]">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-center text-3xl md:text-4xl font-medium text-[#281000]">New Arrival</h2>
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {categoryTabs.map((cat) => (
                            <button key={cat} onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2 text-sm rounded-full transition-all ${activeCategory === cat ? 'bg-[#281000] text-white' : 'bg-white border border-gray-200 text-black'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center py-24 text-gray-400 gap-3">
                        <p className="text-lg">No products found</p>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                    {paginated.map((product) => (
                        <Link key={product._id} href={`/retail/product/${product.slug}`}
                            className="group block bg-[#FFFEF9] hover:shadow-xl transition-all duration-300">

              <div className="relative h-[220px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl"
  onMouseEnter={() => setActiveImage((prev) => ({ ...prev, [product._id]: true }))}
  onMouseLeave={() => setActiveImage((prev) => ({ ...prev, [product._id]: false }))}
  onTouchStart={() => setActiveImage((prev) => ({ ...prev, [product._id]: true }))}
  onTouchEnd={() => setActiveImage((prev) => ({ ...prev, [product._id]: false }))}
>
  <Image src={product.images?.[0] || '/retail/newArrivals/1.png'} alt={product.name} fill
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    className={`object-cover transition-all duration-500 ${activeImage[product._id] ? "opacity-0 scale-105" : "opacity-100"}`} />
  <Image src={product.images?.[1] || product.images?.[0] || '/retail/newArrivals/2.png'} alt={product.name} fill
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    className={`object-cover transition-all duration-500 ${activeImage[product._id] ? "opacity-100 scale-105" : "opacity-0"}`} />
</div>

                            <div className="p-3 sm:p-6">
                               <h3 className="text-[15px] sm:text-xl font-bold text-black mb-2 line-clamp-1">{product.name}</h3>
                              <p className="text-[11px] sm:text-[14px] text-black/70 leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">{product.description}</p>
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                                   <button onClick={(e) => e.preventDefault()} className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-6 py-2 border border-[#281000] text-[#281000] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#281000] hover:text-white transition-all">
                                        Add to Cart →
                                    </button>
                               {product.colors?.length > 0 && (
                               <div className="order-1 sm:order-2 flex items-center justify-center sm:justify-end gap-3">
                                    {product.colors.slice(0, 4).map((color, i) => (
                                        <button key={i} onClick={(e) => { e.preventDefault(); setSelectedColors({ ...selectedColors, [product._id]: color.name }); }}
                                            title={color.name}
                                            className={`w-4 h-4 rounded-full transition-all ${selectedColors[product._id] === color.name ? 'ring-2 ring-offset-2 scale-125' : ''}`}
                                            style={{ backgroundColor: color.hex || '#ccc' }} />
                                    ))}
                                    </div>
                               )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom Section */}
                {filteredProducts.length > 0 && (
                <div className="flex flex-col items-center mt-20">
                    <p className="text-[#0E0E0E] text-lg font-normal mb-4">Showing {paginated.length} of {filteredProducts.length}</p>
                    {hasMore && (
                    <button onClick={() => setPage((p) => p + 1)}
                        className="w-[200px] h-[52px] rounded-full bg-[#FEE6C3] text-[#0E0E0E] text-[16px] font-medium transition-all duration-300 hover:bg-[#281000] hover:text-white hover:scale-105">
                        SEE MORE
                    </button>
                    )}
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mt-8 text-[#0E0E0E] text-[14px] font-medium tracking-tight hover:text-[#281000] transition-colors">
                        ↑ BACK TO TOP
                    </button>
                </div>
                )}
            </div>
        </section>
    );
}
