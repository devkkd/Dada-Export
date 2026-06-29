'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CheckoutDrawer({
  open,
  onClose,
  product,
}) {

  if (!product) return null;
 const [items, setItems] = useState([]);

useEffect(() => {
  if (product) {
    setItems([
      {
        ...product,
        quantity: 1,
      },
    ]);
  }
}, [product]);

  const increaseQty = (index) => {
    const updated = [...items];

    updated[index].quantity =
      (updated[index].quantity || 1) + 1;

    setItems(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...items];

    if ((updated[index].quantity || 1) > 1) {
      updated[index].quantity -= 1;
    }

    setItems(updated);

  };
const removeItem = () => {
  onClose();
};

  const totalAmount = items.reduce(
    (acc, item) =>
      acc +
      item.price *
      (item.quantity || 1),
    0
  );

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 ${open
          ? 'opacity-100'
          : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Drawer */}

      <div
        className={`fixed right-0 top-0 h-screen w-[420px] max-w-full bg-[#FDF8F4] z-50 transition-transform duration-300 flex flex-col ${open
          ? 'translate-x-0'
          : 'translate-x-full'
          }`}
      >
        {/* Header */}

        <div className="h-[52px] border-b border-[#D8C8BC] flex items-center justify-center relative">

          <h2 className="text-[18px] font-medium text-[#281000] uppercase">
            Cart
          </h2>

          <button
            onClick={onClose}
            className="absolute right-6 text-[28px] text-[#281000]"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-4">

          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#281000]/60">
              Cart is empty
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start relative mb-6"
                >
                  {/* Product Image */}

                  <div className="relative w-[140px] h-[180px] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}

                  <div className="flex-1">

                    <h3 className="text-[16px] leading-[1.7] text-[#281000]">
                      {item.name}
                    </h3>

                    <p className="mt-4 text-[13px] text-[#281000]/80">
                      Size : {item.size} | Colors : {item.color}
                    </p>

                    <div className="flex items-center gap-5 mt-4">

                      <p className="text-[20px] font-semibold text-[#281000]">
                        ₹{item.price}
                      </p>

                      {/* Quantity */}

                      <div className="flex items-center border border-[#BCAAA0] rounded-full overflow-hidden h-[45px]">

                        <button
                          onClick={() => decreaseQty(index)}
                          className="w-[32px] h-[52px] text-[24px] text-[#281000] flex items-center justify-center"
                        >
                          −
                        </button>

                        <span className="px-5 text-[18px] font-medium text-black">
                          {item.quantity || 1}
                        </span>

                        <button
                          onClick={() => increaseQty(index)}
                          className="w-[52px] h-[52px] text-[24px] text-[#281000] flex items-center justify-center"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="mt-4 text-red-500 text-sm"
                    >
                      Remove Product
                    </button>

                  </div>



                </div>
              ))}
            </>
          )}
        </div>

        {/* Coupon */}

        <div className="px-2 py-6  border-[#D8C8BC]">

          <label className="block mb-3 text-[#281000]">
            Coupon Code
          </label>

          <div className="flex border border-[#BCAAA0] rounded-3xl overflow-hidden bg-white">

            <input
              type="text"
              placeholder="Type your code here"
              className="flex-1 px-6 h-[52px] outline-none bg-transparent text-[#281000] placeholder:text-[#BCAAA0]"
            />

            <button className="px-8 bg-[#281000] text-white rounded-full mr-3 h-[34px] self-center">
              Apply
            </button>
          </div>
        </div>



        {/* Footer */}

        <div className="border-t border-[#D8C8BC]">

          {/* Buttons */}

          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-5">

              <button
                onClick={onClose}
                className="h-[58px] rounded-full bg-[#F7DEB0] text-[#281000] text-[16px] font-medium"
              >
                Continue Shopping
              </button>

              <button
                className="h-[58px] rounded-full bg-[#281000] text-white text-[16px] font-medium"
              >
                Continue To Checkout
              </button>

            </div>
          </div>

          {/* Shiprocket */}

          <div className="border-t border-[#D8C8BC] py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[#281000]/80 text-[15px]">
              <span>POWERED BY</span>
              <img
                src="/retail/newArrivals/19.png"
                alt="shiprocket"
                className="h-5"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}