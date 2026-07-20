// components/NewArrivalSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRetailData } from '@/components/retail/RetailDataContext';

export default function NewArrivalSection() {
  const { allProducts, categories } = useRetailData();

  // Find 'tops' category
  const cat = categories.find((c) => !c.parentId && c.slug === 'tops');

  const subcatIds = (cat?.subcategories || []).map((s) => String(s._id));
  const products = cat
    ? allProducts.filter((p) =>
        String(p.category) === String(cat._id) ||
        subcatIds.includes(String(p.subcategory))
      ).slice(0, 4)
    : [];

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-[#FFF7F2]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-medium text-[#281000]">
            {cat?.name || 'Tops'}
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/retail/product/${product.slug}`}
              className="group block bg-[#FFF7F2] hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-[180px] sm:h-[260px] lg:h-[380px] overflow-hidden rounded-xl sm:rounded-2xl">
                <Image
                  src={product.images?.[0] || '/retail/home/12.png'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

             <div className="p-2.5 sm:p-4 lg:p-6">
               <h3 className="text-[13px] sm:text-lg lg:text-xl font-bold text-black mb-1 line-clamp-1">{product.name}</h3>

              <p className="text-[10px] sm:text-[13px] lg:text-[14px] text-black/70 leading-4 sm:leading-5 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4">
                  {product.description}
                </p>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 mt-2 sm:mt-5">

  <button onClick={(e) => e.preventDefault()} className="w-full sm:w-auto px-2 sm:px-5 py-1.5 sm:py-2.5 border border-[#281000] text-[#281000] rounded-full text-[10px] sm:text-sm font-medium hover:bg-[#281000] hover:text-white transition-all">
    Add to Cart →
  </button>

  {product.colors?.length > 0 && (
  <div className="flex justify-center sm:justify-end items-center gap-2 sm:gap-3">
    {product.colors.slice(0, 4).map((color, i) => (
      <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
        style={{ backgroundColor: color.hex || '#ccc' }} title={color.name} />
    ))}
  </div>
  )}

</div>
              </div>
            </Link>
          ))}
        </div>

        {cat && (
          <div className="flex justify-center mt-10">
            <Link href={`/retail/category/${cat.slug}`}
              className="px-8 py-3 bg-[#281000] hover:bg-[#3a1a00] text-white rounded-full text-sm font-medium transition-colors">
              View All {cat.name} →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
