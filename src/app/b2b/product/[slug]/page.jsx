'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    slug: 'botanical-halter-maxi',
    category: 'Dresses',
    img: '/b2b/home/7.png',
    hoverImg: '/b2b/home/8.png',
    title: 'Botanical Halter Maxi',
    desc: 'Adjustable back strap · Back tie-up · Floor length · Breathable rayon · 100% Premium Rayon · Halter Maxi Dress',
    colors: ['#4A7043', '#2B4C7A', '#95565E', '#3C2F2F'],
  },
  {
    id: 2,
    slug: 'floral-summer-dress',
    category: 'Dresses',
    img: '/b2b/home/8.png',
    hoverImg: '/b2b/home/7.png',
    title: 'Floral Summer Dress',
    desc: 'Soft rayon fabric · Lightweight · Printed design · Comfortable fit',
    colors: ['#4A7043', '#2B4C7A', '#95565E'],
  },
  {
    id: 3,
    slug: 'casual-printed-top',
    category: 'Tops',
    img: '/b2b/home/9.png',
    hoverImg: '/b2b/home/10.png',
    title: 'Casual Printed Top',
    desc: 'Premium rayon · Breathable fabric · Everyday comfort · Stylish look',
    colors: ['#2B4C7A', '#95565E', '#3C2F2F'],
  },
  {
    id: 4,
    slug: 'boho-crop-top',
    category: 'Tops',
    img: '/b2b/home/10.png',
    hoverImg: '/b2b/home/9.png',
    title: 'Boho Crop Top',
    desc: 'Relaxed fit · Soft fabric · Trendy silhouette · Export quality',
    colors: ['#4A7043', '#95565E', '#3C2F2F'],
  },
];

import { use } from "react";

export default function ProductDetail({ params }) {

  const { slug } = use(params);

  const [selectedColor, setSelectedColor] = useState('#4A7043');
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [activeImage, setActiveImage] = useState({});
  const [quantity, setQuantity] = useState(50);
  const [mainImage, setMainImage] = useState('/b2b/NewArrivals/1.png');
  const product = products.find(p => p.slug === slug) || {
    title: 'Women Olive Floral Adjustable Halter Neck Maxi Dress',
    price: '₹1,01,000',
    moq: 'MOQ: 10',
    mainImage: '/b2b/NewArrivals/1.png',
    fabric: '100% Premium Rayon',
    color: 'Olive Green',
    colors: ['#4A7043', '#2B4C7A', '#95565E', '#3C2F2F'],
  };

  // Thumbnail images - adjust paths as needed
  const thumbnailImages = [
    '/b2b/NewArrivals/1.png',
    '/b2b/NewArrivals/2.png',
    '/b2b/NewArrivals/3.png',
    '/b2b/NewArrivals/4.png',
  ];

  const highlightData = [
    ['Color', 'Olive Green', 'Occasion', 'Casual'],
    ['Fabric', 'Rayon', 'Sleeve Length', 'Sleeveless'],
    ['Fit Shape', 'Fit and Flare', 'Sleeve Styling', 'Shoulder Strap'],
    ['Length', 'Maxi', 'Pattern', 'Printed'],
    ['Neck', 'Shoulder Straps', 'Occasion', 'Casual'],
    ['Print or Pattern Type', 'Floral', '', ''],
  ];

  const keyFeatures = [
    'Premium quality 100% rayon fabric',
    'Adjustable halter neck with back tie-up',
    'Flowy maxi silhouette with graceful movement',
    'Breathable & skin-friendly material',
    'Designed for all-day comfort',
  ];

  const careInstructions = [
    'Hand wash separately in cold water',
    'Use mild detergent only',
    'Do not bleach',
    'Dry in shade to maintain color',
    'Iron on low temperature if needed',
  ];

  const similarProducts = products.filter(p => p.slug !== slug).slice(0, 4);

  return (
   <div className="w-full bg-[#FFFEF9] min-h-screen">
  <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">
        {/* Product Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          
          {/* Left Side - Images */}
          <div className="space-y-6">
            {/* Main Image */}
      <div
  className="
    relative
    w-full
   h-[260px]
sm:h-[340px]
md:h-[420px]
lg:h-[500px]
xl:h-[580px]
2xl:h-[650px]
    rounded-[24px]
    overflow-hidden
    border
    border-[#E8DED8]
  "
>


              <Image 
                src={mainImage} 
                alt={product.title} 
                fill 
                className="object-cover" 
                priority 
              />
            </div>

            {/* Thumbnail Gallery - 4x4 Grid */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnailImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square relative rounded-xl overflow-hidden transition-all duration-300 ${
                    mainImage === img
                      ? 'border-3 border-[#95565E] shadow-lg'
                      : 'border-2 border-gray-300 hover:border-[#95565E]'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`View ${i + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="pt-4">
            {/* Product Category/Breadcrumb */}
            <p className="text-sm text-gray-600 mb-4">Tie-Up Drawstring Peony A-Line Summer Dress</p>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0E0E0E] leading-tight mb-6">
              {product.title}
            </h1>

            {/* Price and MOQ */}
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-4xl font-bold text-[#0E0E0E]">₹1,01,000</p>
              <p className="text-[#0E0E0E] text-sm font-medium">MOQ: 10</p>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-3 text-[#0E0E0E]">Size</p>
              <div className="flex gap-3 flex-wrap">
                {['Free Size', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-[#95565E] text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-[#95565E]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-10">
              <p className="text-sm font-medium mb-3 text-[#0E0E0E]">Colors</p>
              <div className="flex gap-4 flex-wrap">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-[#95565E] scale-125'
                        : 'shadow-md hover:shadow-lg'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            {/* Minimum Order Quantity */}

<div className="mb-8">

  <p className="text-sm font-medium text-[#0E0E0E] mb-3">
    Minimum Order Quantity
  </p>

  <div className="flex items-center justify-between w-[200px] h-[50px] border border-[#CDBEB5] rounded-full px-6">

    <button
      onClick={() =>
        setQuantity((prev) =>
         prev > 50 ? Math.max(50, prev - 10) : 50
        )
      }
      className="text-[32px] leading-none font-light text-black"
    >
      −
    </button>

    <span className="text-[18px]  text-black">
      {quantity}
    </span>

    <button
      onClick={() =>
        setQuantity((prev) => prev + 10)
      }
      className="text-[32px] leading-none font-light text-black"
    >
      +
    </button>

  </div>

  <p className="text-xs text-gray-500 mt-3">
    Minimum Order: 50 Pieces
  </p>

</div>

            {/* Enquire Button */}
           {/* Enquire + Cart Buttons */}

<div className="grid grid-cols-2 gap-4 mb-12">

  <Link
    href={`/b2b/enquiry?product=${slug}&name=${encodeURIComponent(product.title)}&size=${selectedSize}`}
    className="h-[58px] flex items-center justify-center rounded-full bg-[#95565E] text-white font-semibold hover:bg-[#7a3f47] transition"
  >
    Enquire Now
  </Link>

  <button
    onClick={() => {

      const cart =
        JSON.parse(localStorage.getItem('cart')) || [];

      const index = cart.findIndex(
        (item) => item.slug === slug
      );

      if (index !== -1) {

     cart[index].quantity += quantity;

      } else {

        cart.push({

          id: product.id,

          slug,

          name: product.title,

          image: mainImage,

          price: 101000,

       quantity: quantity,

          size: selectedSize,

          fabric: product.fabric || "Premium Rayon",

          print: "Floral",

        });

      }

      localStorage.setItem(
        'cart',
        JSON.stringify(cart)
      );

    alert(`${quantity} Pieces Added To Cart`);

    }}

    className="h-[58px] rounded-full border-2 border-[#95565E] text-[#95565E] font-semibold hover:bg-[#95565E] hover:text-white transition"
  >
    Add To Cart
  </button>

</div>

            {/* Product Info Sections */}
            <div className="space-y-10 text-[#0E0E0E]">
              
              {/* Product Highlights Table */}
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#0E0E0E] mb-6">
                 
                  Product Highlights
                </h3>

                <div className="overflow-hidden rounded-lg border border-[#E8E0D8] ">
                  {highlightData.map((row, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-2 md:grid-cols-4 ${
                        index % 2 === 0 ? 'bg-[#F9F4E1]' : 'bg-white'
                      }`}
                    >
                      {/* Label 1 */}
                      <div className="px-4 md:px-6 py-4 md:py-5 border-r border-b md:border-b border-[#E8E0D8]">
                        <p className="text-[12px] md:text-[13px] text-[#A89899]">
                          {row[0]}
                        </p>
                      </div>

                      {/* Value 1 */}
                      <div className="px-4 md:px-6 py-4 md:py-5 border-b md:border-r md:border-b border-[#E8E0D8]">
                        <p className="text-[12px] md:text-[14px] font-medium text-[#0E0E0E]">
                          {row[1]}
                        </p>
                      </div>

                      {/* Label 2 - Hidden on mobile */}
                      <div className="hidden md:block px-6 py-5 border-r border-b border-[#E8E0D8]">
                        <p className="text-[13px] text-[#A89899]">
                          {row[2]}
                        </p>
                      </div>

                      {/* Value 2 - Hidden on mobile */}
                      <div className="hidden md:block px-6 py-5 border-b border-[#E8E0D8]">
                        <p className="text-[14px] font-medium text-[#0E0E0E]">
                          {row[3]}
                        </p>
                      </div>

                      {/* Mobile: Label 2 on new row */}
                      {row[2] && (
                        <div className="md:hidden px-4 py-4 border-r border-[#E8E0D8]">
                          <p className="text-[12px] text-[#A89899]">
                            {row[2]}
                          </p>
                        </div>
                      )}

                      {/* Mobile: Value 2 on new row */}
                      {row[3] && (
                        <div className="md:hidden px-4 py-4">
                          <p className="text-[12px] font-medium text-[#0E0E0E]">
                            {row[3]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <div className="border-t border-[#E8E0D8] pt-8 md:pt-10">
  <h3 className="text-xl md:text-2xl font-semibold text-[#0E0E0E] mb-4">
    Product Description
  </h3>
</div>
                <p className="text-sm md:text-base leading-relaxed text-[#3C2F2F]">
                  Step into effortless elegance with this olive floral halter neck maxi dress. 
                  Crafted from premium rayon, this flowy maxi dress is lightweight and breathable. 
                  Perfect for vacations, brunches, casual outings, summer parties, and resort wear.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <div className="border-t border-[#E8E0D8] pt-8 md:pt-10">
  <h3 className="text-xl md:text-2xl font-semibold text-[#0E0E0E] mb-4">
    Key Features
  </h3>
</div>
                <ul className="space-y-3 text-sm md:text-base text-[#3C2F2F] pl-5 list-disc">
                  {keyFeatures.map((feature, i) => (
                    <li key={i} className="leading-relaxed">{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Fabric Care Instructions */}
              <div>
                <div className="border-t border-[#E8E0D8] pt-8 md:pt-10">
  <h3 className="text-xl md:text-2xl font-semibold text-[#0E0E0E] mb-4">
    Fabric Care Instructions
  </h3>
</div>
                <ul className="space-y-2 text-sm md:text-base text-[#3C2F2F] list-disc pl-5">
                  {careInstructions.map((instruction, i) => (
                    <li key={i} className="leading-relaxed">{instruction}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 border-b border-[#E8E0D8]" />
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-20 pt-12 ">
          <h2 className="text-3xl md:text-4xl font-bold text-[#95565E] text-center mb-12">
            Similar Products
          </h2>

         <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {similarProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/b2b/product/${prod.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
               <div
  className="relative h-[220px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-2xl bg-gray-100"

  onMouseEnter={() =>
    setActiveImage(prev => ({
      ...prev,
      [prod.id]: true,
    }))
  }

  onMouseLeave={() =>
    setActiveImage(prev => ({
      ...prev,
      [prod.id]: false,
    }))
  }

  onTouchStart={() =>
    setActiveImage(prev => ({
      ...prev,
      [prod.id]: true,
    }))
  }

  onTouchEnd={() =>
    setActiveImage(prev => ({
      ...prev,
      [prod.id]: false,
    }))
  }
>

  {/* Main Image */}

  <Image
    src={prod.img}
    alt={prod.title}
    fill
    className={`object-cover transition-all duration-500 ${
      activeImage[prod.id]
        ? 'opacity-0 scale-105'
        : 'opacity-100'
    }`}
  />

  {/* Hover Image */}

  <Image
    src={prod.hoverImg || prod.img}
    alt={prod.title}
    fill
    className={`object-cover transition-all duration-500 ${
      activeImage[prod.id]
        ? 'opacity-100 scale-105'
        : 'opacity-0'
    }`}
  />

</div>

                {/* Content */}
<div className="p-3 sm:p-6">
                <h3 className="text-[15px] sm:text-xl font-bold text-[#0E0E0E] mb-2 line-clamp-1">
                    {prod.title}
                  </h3>

                 <p className="text-[11px] sm:text-[14px] text-[#3C2F2F] leading-5 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-5">
                    {prod.desc}
                  </p>

                  {/* Footer with Button and Colors */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">

  {/* Colors */}
  <div className="order-1 sm:order-2 flex items-center justify-center sm:justify-end gap-2">
    {prod.colors.map((color, i) => (
      <button
        key={i}
        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full hover:scale-110 transition-transform"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>

  {/* Enquire */}
  <button className="order-2 sm:order-1 w-full sm:w-auto px-3 sm:px-5 py-2 border border-[#95565E] text-[#95565E] rounded-full text-[11px] sm:text-sm font-medium hover:bg-[#95565E] hover:text-white transition-all">
    Enquire →
  </button>

</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}