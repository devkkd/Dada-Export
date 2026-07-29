// components/NewArrivalSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRetailData } from '@/components/retail/RetailDataContext';
import { useRetailAuth } from '@/context/RetailAuthContext';

export default function NewArrivalSection() {
  const { allProducts, categories } = useRetailData();
  const { isLoggedIn, refreshCartCount } = useRetailAuth();
  const [selectedColors, setSelectedColors] = useState({});
  const [cartSaving, setCartSaving] = useState({});

  const showToast = (message, isSuccess = true) => {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('retail-dynamic-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'retail-dynamic-toast';
    toast.className = `fixed bottom-5 right-5 z-[99999] px-6 py-3.5 rounded-full text-white text-xs font-semibold shadow-xl transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2 ${
      isSuccess ? 'bg-[#281000]' : 'bg-red-600'
    }`;
    toast.innerHTML = isSuccess 
      ? `<span>✓</span> <span>${message}</span>`
      : `<span>⚠</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-10', 'opacity-0'), 50);
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      document.dispatchEvent(new CustomEvent('openLoginPopup'));
      showToast('Please login to add to cart', false);
      return;
    }

    const defaultSize = product.variants?.[0]?.size || 'M';
    const selectedColor = selectedColors[product._id] || product.colors?.[0]?.name || 'N/A';

    setCartSaving(prev => ({ ...prev, [product._id]: true }));
    try {
      const res = await fetch('/api/retail/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          size: defaultSize,
          color: selectedColor,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add to cart');

      refreshCartCount();
      showToast('Added to cart successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not add to cart', false);
    } finally {
      setCartSaving(prev => ({ ...prev, [product._id]: false }));
    }
  };

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

                <button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  disabled={cartSaving[product._id]}
                  className="w-full sm:w-auto px-2 sm:px-5 py-1.5 sm:py-2.5 border border-[#281000] text-[#281000] rounded-full text-[10px] sm:text-sm font-medium hover:bg-[#281000] hover:text-white transition-all disabled:opacity-50"
                >
                  {cartSaving[product._id] ? 'Adding...' : 'Add to Cart →'}
                </button>

                {product.colors?.length > 0 && (
                  <div className="flex justify-center sm:justify-end items-center gap-2 sm:gap-3">
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
