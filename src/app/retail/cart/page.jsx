'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRetailAuth } from '@/context/RetailAuthContext';

export default function CartPage() {
  const { isLoggedIn, isLoading, localCartSynced } = useRetailAuth();
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCart = async () => {
      if (isLoading || (isLoggedIn && !localCartSynced)) return;

      if (isLoggedIn) {
        setLoadingCart(true);
        try {
          const res = await fetch('/api/retail/cart', {
            credentials: 'include',
          });
          const data = await res.json();
          setItems(data.data?.items || []);
        } catch {
          setItems([]);
          setError('Unable to load cart.');
        } finally {
          setLoadingCart(false);
        }
      } else {
        try {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setItems(Array.isArray(localCart) ? localCart : []);
        } catch {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [isLoggedIn, isLoading, localCartSynced]);

  const updateQty = async (index, type) => {
    const updated = [...items];

    if (type === 'plus') {
      updated[index].quantity =
        (updated[index].quantity || 1) + 1;
    }

    if (
      type === 'minus' &&
      (updated[index].quantity || 1) > 1
    ) {
      updated[index].quantity -= 1;
    }

    if (isLoggedIn) {
      try {
        const item = updated[index];
        const res = await fetch('/api/retail/cart', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item._id, quantity: item.quantity }),
        });
        const data = await res.json();
        if (res.ok) {
          setItems(data.data?.items || updated);
          return;
        }
        throw new Error(data.error || 'Update failed');
      } catch (err) {
        console.error(err);
        setError('Could not update quantity.');
        return;
      }
    }

    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = async (index) => {
    const updated = items.filter((_, i) => i !== index);

    if (isLoggedIn) {
      try {
        const item = items[index];
        const res = await fetch('/api/retail/cart', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item._id }),
        });
        const data = await res.json();
        if (res.ok) {
          setItems(data.data?.items || updated);
          return;
        }
        throw new Error(data.error || 'Remove failed');
      } catch (err) {
        console.error(err);
        setError('Could not remove item.');
        return;
      }
    }

    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };  const getCleanFields = (fields) => {
    if (!fields) return {};
    if (typeof fields.toJSON === 'function') return fields.toJSON();
    if (fields instanceof Map) return Object.fromEntries(fields);
    return fields;
  };

  const totalAmount = items.reduce(
    (acc, item) =>
      acc +
      (item.price + (item.customizationPrice || 0)) *
        (item.quantity || 1),
    0
  );

  return (
    <div className="bg-[#FFF7F2] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        <h1 className="text-2xl md:text-3xl font-semibold text-[#281000] mb-10">
          Shopping Cart
        </h1>

        {items.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 text-center">
            <p className="text-[#281000]/70 text-lg">
              Your cart is empty.
            </p>
          </div>

        ) : (

          <>
            <div className="space-y-6">

              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6"
                >
                  {/* Product Image */}

                  <div className="relative w-full md:w-[180px] h-[240px] md:h-[240px] flex-shrink-0">
                    <Image
                      src={item.image || '/retail/home/7.png'}
                      alt={item.name || 'Product'}
                      fill
                      unoptimized
                      className="object-cover rounded-2xl"
                    />
                  </div>

                  {/* Product Info */}

                  <div className="flex-1">

                    <h3 className="text-10px md:text-xl font-semibold text-black">
                      {item.name}
                    </h3>

                    <div className="mt-3 space-y-1 text-[#0E0E0E]/70 text-[13px] font-normal leading-4">
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                      {item.fabric && <p>Fabric: {item.fabric}</p>}
                    </div>

                    {item.isCustomized && (
                      <div className="mt-4">
                        <details className="cursor-pointer group">
                          <summary className="text-[12px] font-bold text-[#281000] hover:underline transition-colors select-none flex items-center gap-1.5">
                            <span>✨</span> View Customization Details
                          </summary>
                          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 p-4 rounded-2xl bg-[#FFF9F5] border border-[#E8DED8]/60 text-xs text-neutral-700 font-medium">
                            {Object.entries(getCleanFields(item.customizationFields)).map(([key, val]) => (
                              <div key={key} className="flex flex-col border-b border-[#E8DED8]/25 pb-1">
                                <span className="capitalize text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-[#281000] font-semibold">{val || 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mt-6">

                      <div>
                        <p className="text-2xl font-semibold text-[#0E0E0E]">
                          ₹{(item.price + (item.customizationPrice || 0)) * (item.quantity || 1)}
                        </p>
                        {item.isCustomized && (
                          <span className="text-[11px] text-neutral-500 font-medium block mt-1">
                            (Base: ₹{item.price} + Customization: ₹{item.customizationPrice})
                          </span>
                        )}
                      </div>

                      {/* Quantity */}

                      <div className="flex items-center border border-[#CDBDB0] rounded-full overflow-hidden h-[48px] w-fit">

                        <button
                          onClick={() =>
                            updateQty(index, 'minus')
                          }
                          className="w-12 h-12 flex items-center justify-center text-xl text-[#281000]"
                        >
                          −
                        </button>

                        <span className="px-5 font-medium text-black">
                          {item.quantity || 1}
                        </span>

                        <button
                          onClick={() =>
                            updateQty(index, 'plus')
                          }
                          className="w-12 h-12 flex items-center justify-center text-xl text-[#281000]"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="mt-5 text-red-500 text-sm font-medium"
                    >
                      Remove Product
                    </button>

                  </div>
                </div>
              ))}

            </div>

            {/* Summary */}

            <div className="mt-10 bg-white rounded-3xl p-6 md:p-8">

              <div className="flex items-center justify-between border-b border-[#E5D8CE] pb-5">

                <h3 className="text-lg md:text-xl font-medium text-[#0E0E0E]">
                  Total Amount
                </h3>

                <p className="text-3xl font-semibold text-[#0E0E0E]">
                  ₹{totalAmount}
                </p>

              </div>

           <button
  onClick={() => {
    if (isLoggedIn) {
      window.location.href = '/retail/checkout';
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('retailLoginCallback', '/retail/checkout');
      }
      document.dispatchEvent(new CustomEvent('openLoginPopup'));
    }
  }}
  className="w-full mt-6 h-[58px] rounded-full bg-[#281000] text-white font-semibold text-base md:text-lg hover:opacity-90 transition"
>
  Proceed To Payment
</button>

            </div>
          </>
        )}

      </div>
      
    </div>
  );
}