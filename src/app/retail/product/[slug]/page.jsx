'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import CheckoutDrawer from '@/components/retail/CheckoutDrawer';
const ProductDetailPage = () => {
  const [activeImage, setActiveImage] = useState(0);
const [selectedPrint, setSelectedPrint] = useState('Floral');
  const [selectedSize, setSelectedSize] = useState('Small');

  const [quantity, setQuantity] = useState(1);
  const [selectedFabricCustom, setSelectedFabricCustom] = useState('Cotton');
  const [selectedColor, setSelectedColor] = useState('Olive Green');

const [topFit, setTopFit] = useState('Fitted');
const [bottomFit, setBottomFit] = useState('Fitted');
const [waistBand, setWaistBand] = useState('Elasticated');
const [backStyle, setBackStyle] = useState('Open Back');

const [bodyUnit, setBodyUnit] = useState('IN');
const [lengthUnit, setLengthUnit] = useState('IN');

const [buyNowOpen, setBuyNowOpen] = useState(false);
const [buyNowProduct, setBuyNowProduct] = useState(null);

  const images = [
    '/retail/home/7.png',
    '/retail/home/8.png',
    '/retail/home/9.png',
    '/retail/home/10.png',
  ];

  const prints = [
  'Floral',
  'Paisley',
  'Block Print',
  'Abstract',
  'Striped',
  'Polka Dot',
];

  const sizes = ['Small', 'Medium', 'Large'];
const colors = [
  {
    name: 'Olive Green',
    code: '#6B7B4F',
  },
  {
    name: 'Black',
    code: '#1F1F1F',
  },
  {
    name: 'Ivory',
    code: '#F7F4ED',
  },
  {
    name: 'Wine',
    code: '#7B2432',
  },
  {
    name: 'Navy',
    code: '#1E3A5F',
  },
  {
    name: 'Mustard',
    code: '#D8A031',
  },
  {
    name: 'Rust',
    code: '#B85C38',
  },
  {
    name: 'Dusty Pink',
    code: '#D7A6B5',
  },
];

  return (
    <>
    <div className="bg-[#FFF7F2] min-h-screen pb-20">
    <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-20 xl:px-24 pt-12 pb-20">

        {/* Breadcrumb */}
        

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
       
         {/* ================= LEFT: IMAGE GALLERY ================= */}
<div>
  <div className="grid grid-cols-2 gap-3">

    {images.map((img, idx) => (
      <div
        key={idx}
        onClick={() => setActiveImage(idx)}
        className={`relative aspect-[4/5] overflow-hidden cursor-pointer rounded-md border transition-all ${
          activeImage === idx
            ? 'border-[#281000]'
            : 'border-transparent'
        }`}
      >
        <Image
          src={img}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    ))}

  </div>
</div>

          {/* ================= RIGHT: PRODUCT DETAILS ================= */}
          <div className="space-y-8">
           <div className=" pb-3">
  <h1
    className="text-[26px] lg:text-[26px] font-medium text-[#0E0E0E] leading-[1.15] "
    style={{ fontFamily: 'Mona Sans, sans-serif' }}
  >
    Women Olive Floral Adjustable Halter Neck Maxi Dress
  </h1>

  <p className="text-sm md:text-[16px] text-[#0E0E0E]/80 mt-3">
  Tie-Up Drawstring Flowy A-Line Summer Dress
</p>

  <div className="flex flex-wrap items-center gap-4 mt-6">
    <p className="text-3xl font-semibold text-[#0E0E0E]">
      ₹1,899.00
    </p>

    <span className="px-5 py-2 rounded-full bg-green-600 text-white text-sm">
      Available
    </span>

    <p className="text-[16px] md:text-[16px] text-[#0E0E0E]/70">
  Free Delivery on Orders Above ₹999
</p>
  </div>
</div>

           
         
          
            {/* Size Selector */}
          <div className=" ">
 <p className="text-[#0E0E0E]/75 mb-2 font-normal text-[18px]">
  Size
</p>

  <div className="flex flex-wrap gap-4">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`px-7 py-2 rounded-full border transition-all duration-300 ${
          selectedSize === size
            ? 'bg-[#281000] text-white border-[#281000]'
            : 'bg-transparent text-black border-[#C8BDB2]'
        }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>
 {/* Prints Selector */}

<div>
  <p className="text-[#0E0E0E]/75 mb-2 font-normal text-[18px]">
    Prints
  </p>

  <div className="flex flex-wrap gap-4">
    {prints.map((print) => (
      <button
        key={print}
        onClick={() => setSelectedPrint(print)}
        className={`px-6 py-2 rounded-full border transition-all duration-300 ${
          selectedPrint === print
            ? 'bg-[#281000] text-white border-[#281000]'
            : 'bg-transparent text-black border-[#C8BDB2]'
        }`}
      >
        {print}
      </button>
    ))}
  </div>
</div>


 {/* Surprise Gift Card */}
<div className="relative overflow-hidden rounded-[20px] bg-[#2B0D00] text-white min-h-[140px] md:min-h-[160px]">

  {/* Horizontal Ribbon */}
  <div className="absolute top-4 left-0 right-0 h-[8px] bg-gradient-to-r from-[#8A5A00] via-[#F2D27A] to-[#8A5A00]" />

  {/* Vertical Ribbon */}
  <div className="absolute top-0 bottom-0 left-14 w-[8px] bg-gradient-to-b from-[#8A5A00] via-[#F2D27A] to-[#8A5A00]" />

  {/* Bow */}
<div className="absolute left-3 sm:left-8 md:left-6 lg:left-6 top-0 sm:top-0 z-20">
    <svg
      width="90"
      height="70"
      viewBox="0 0 90 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[55px] md:w-[72px] h-auto"
    >
      <path
        d="M45 35C35 25 8 12 2 18C-4 24 18 38 45 40Z"
        fill="#EBCB7A"
      />
      <path
        d="M45 35C55 25 82 12 88 18C94 24 72 38 45 40Z"
        fill="#EBCB7A"
      />
      <path
        d="M42 38L20 60L38 52L45 42Z"
        fill="#D9B35C"
      />
      <path
        d="M48 38L70 60L52 52L45 42Z"
        fill="#D9B35C"
      />
      <ellipse
        cx="45"
        cy="35"
        rx="10"
        ry="8"
        fill="#A46A3D"
      />
    </svg>
  </div>

  {/* Content */}
  <div className="relative z-10 pl-24 md:pl-28 pr-5 md:pr-6 py-7 md:py-7">

    <p className="uppercase tracking-[0.15em] text-[10px] md:text-[11px] font-bold text-[#F3D8A6] mb-2">
      Something Extra, Just For You
    </p>

    <h3 className="text-[18px] md:text-[22px] font-semibold leading-tight mb-2">
      Shop ₹4,000 & Get a Surprise Gift
    </h3>

    <p className="text-[#F7E7C7]/90 text-[12px] md:text-[14px] leading-[1.5] max-w-2xl">
      Every Order Above ₹4,000 Includes A Free Mystery Garment.
      <br />
      A Dress, A Skirt, Or A Top Chosen With Care
      <br />
      By Ivera - Dada Exports Team.
    </p>

  </div>
</div>
            {/* Quantity & Buttons */}
            <div className="pt-2">
  <div className="flex flex-col lg:flex-row gap-5">

    

   <button
 onClick={() => {
  const product = {
    id: Date.now(),
    name: 'Women Olive Floral Adjustable Halter Neck Maxi Dress',
    image: images[activeImage],
    price: 1011,
    size: selectedSize,
print: selectedPrint,
    
    quantity: 1,
  };

  const existing =
    JSON.parse(localStorage.getItem('cart')) || [];

  localStorage.setItem(
    'cart',
    JSON.stringify([...existing, product])
  );

 alert('Added To Cart');
}}
  className="flex-1 bg-[#281000] text-white rounded-full py-4 font-medium"
>
  + Add To Cart
</button>

  <button
  onClick={() => {
    setBuyNowProduct({
      image: images[activeImage],
      name: 'Women Olive Floral Adjustable Halter Neck Maxi Dress',
      size: selectedSize,
  print: selectedPrint,
      
      quantity,
      price: 1011,
    });

    setBuyNowOpen(true);
  }}
  className="flex-1 bg-[#F2D9AE] text-[#0E0E0E] rounded-full py-4 font-medium"
>
  Buy Now
</button>

   <button
  onClick={() => {
    document
      .getElementById('customization-section')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  }}
  className="flex-1 border border-[#281000]/25 rounded-full py-4 text-[#0E0E0E] hover:bg-[#281000] hover:text-white transition-all"
>
  Customization
</button>

  </div>
</div>
 {/* ================= MEASUREMENT TABLE & HOW TO MEASURE ================= */}
        <div className="mt-10 border-t border-[#281000]/15 pt-6">

  <h3 className="text-[20px] font-semibold text-[#0E0E0E] mb-6">
    Product Highlights
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-2 text-sm">

      <tbody>

        <tr className="bg-[#F2DDB6]">
          <td className="px-4 py-3 text-[#AE9D9F] w-1/4">
            Color
          </td>
          <td className="px-4 py-3 text-[#0E0E0E] w-1/4">
            Olive Green
          </td>

          <td className="px-4 py-3 text-[#AE9D9F] w-1/4">
            Occasion
          </td>
          <td className="px-4 py-3 text-[#0E0E0E] w-1/4">
            Casual
          </td>
        </tr>

        <tr>
          <td className="px-4 py-3 text-[#AE9D9F]">
            Fabric
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Rayon
          </td>

          <td className="px-4 py-3 text-[#AE9D9F]">
            Sleeve Length
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Sleeveless
          </td>
        </tr>

        <tr className="bg-[#F2DDB6]">
          <td className="px-4 py-3 text-[#AE9D9F]">
            Fit Shape
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Fit and Flare
          </td>

          <td className="px-4 py-3 text-[#AE9D9F]">
            Sleeve Styling
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Shoulder Strap
          </td>
        </tr>

        <tr>
          <td className="px-4 py-3 text-[#AE9D9F]">
            Length
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Maxi
          </td>

          <td className="px-4 py-3 text-[#AE9D9F]">
            Pattern
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Printed
          </td>
        </tr>

        <tr className="bg-[#F2DDB6]">
          <td className="px-4 py-3 text-[#AE9D9F]">
            Neck
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Shoulder Straps
          </td>

          <td className="px-4 py-3 text-[#AE9D9F]">
            Occasion
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Casual
          </td>
        </tr>

        <tr>
          <td className="px-4 py-3 text-[#AE9D9F]">
            Print or Pattern Type
          </td>
          <td className="px-4 py-3 text-[#0E0E0E]">
            Floral
          </td>

          <td></td>
          <td></td>
        </tr>

      </tbody>

    </table>
  </div>

</div>
          </div>
        </div>

       
{/* ================= CUSTOMIZATION FORM ================= */}
{/* ================= CUSTOMIZATION SECTION ================= */}

<div
  id="customization-section"
  className="mt-10 border-t border-[#D5C9C0] pt-12 scroll-mt-24"
>

  <h2 className="text-[24px] md:text-[30px] font-semibold text-[#2A221E]">
    Customization - Your Size. Your Fit. Your Style.
  </h2>

  <p className="mt-3 text-[#6F625A] text-sm md:text-base">
    Custom-Tailored, Export-Quality - Crafted Just For You
  </p>

  {/* FABRIC SELECTION */}

  <div className="mt-10">
    <h3 className="font-semibold text-[#2A221E] mb-6">
      Choose Your Fabric - First, Tell Us Your Fabric.
    </h3>

    <div className="flex flex-wrap gap-6">

      {[
        "Cotton",
        "Rayon",
        "Silk",
        "Georgette",
        "Denim"
      ].map((fabric) => (

        <button
          key={fabric}
          onClick={() => setSelectedFabricCustom(fabric)}
          className="text-center"
        >
          <div
            className={`relative w-[70px] h-[70px] rounded-full overflow-hidden mx-auto transition-all duration-300 ${
              selectedFabricCustom === fabric
                ? 'border-[3px] border-[#281000] scale-105'
                : 'border border-[#C8BDB2]'
            }`}
          >
            <Image
              src="/retail/newArrivals/7.png"
              alt={fabric}
              fill
              className="object-cover"
            />
          </div>

          <p
            className={`mt-2 text-sm ${
              selectedFabricCustom === fabric
                ? 'font-semibold text-[#0E0E0E]'
                : 'text-[#2A221E]'
            }`}
          >
            {fabric}
          </p>
        </button>

      ))}

    </div>
  </div>
  {/* COLOR SELECTION */}

<div className="mt-12">
  <h3 className="font-semibold text-[#2A221E] mb-6">
    Choose Your Colour
  </h3>

  <div className="flex flex-wrap gap-6">

    {colors.map((color) => (

      <button
        key={color.name}
        onClick={() => setSelectedColor(color.name)}
        className="text-center group"
      >

        <div
          className={`relative w-[52px] h-[52px] rounded-full transition-all duration-300 flex items-center justify-center ${
            selectedColor === color.name
              ? 'ring-[3px] ring-[#281000] ring-offset-4 scale-105'
              : ''
          }`}
          style={{
            backgroundColor: color.code,
          }}
        >

          {selectedColor === color.name && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

        </div>

        <p
          className={`mt-3 text-[14px] ${
            selectedColor === color.name
              ? 'font-semibold text-[#281000]'
              : 'text-[#555]'
          }`}
        >
          {color.name}
        </p>

      </button>

    ))}

  </div>
</div>

  {/* FORM */}

  <div className="grid grid-cols-1 lg:grid-cols-4 mt-12 border-b border-[#D5C9C0]">

    {/* COLUMN 1 */}

    <div className="px-5 pb-8 lg:border-r lg:border-[#D5C9C0]">

      <h3 className="font-semibold text-[16px] text-[#2A221E] mb-6">
        Final Details & Special Requests
      </h3>

      <div className="space-y-5">

        <input
          placeholder="First and last name"
          className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] bg-[#FFFDFC] px-4 placeholder:text-[#AE9D9F]"
        />

        <input
          placeholder="+91 your number"
          className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] bg-[#FFFDFC] px-4 placeholder:text-[#AE9D9F]"
        />

        <input
          placeholder="you@email.com"
          className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] bg-[#FFFDFC] px-4 placeholder:text-[#AE9D9F]"
        />

        <input
          placeholder="e.g. Pune, Maharashtra"
          className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] bg-[#FFFDFC] px-4 placeholder:text-[#AE9D9F]"
        />

        <input
          placeholder="6-digit pincode"
          className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] bg-[#FFFDFC] px-4 placeholder:text-[#AE9D9F]"
        />

      </div>

    </div>

    {/* COLUMN 2 */}

    <div className="px-5 pb-8 lg:border-r lg:border-[#D5C9C0]">

      <h3 className="font-semibold text-[16px] text-[#2A221E] mb-6">
        Body Measurements
      </h3>

      <div className="space-y-5">

        {[
          "Height",
          "Bust / Breast Size",
          "Waist",
          "Belly / Tummy Size",
          "Hip Size",
        ].map((field) => (

          <div key={field}>

            <label className="block mb-2 text-sm text-[#2A221E]">
              {field}
            </label>

            <div className="relative">

              <input
                placeholder="e.g. 36 inches"
                className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] pl-4 pr-20 bg-[#FFFDFC] placeholder:text-[#AE9D9F]"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">

                <button
                  onClick={() => setBodyUnit('IN')}
                  className={`w-8 h-8 rounded-full text-xs ${
                    bodyUnit === 'IN'
                      ? 'bg-[#281000] text-white'
                      : 'border border-[#C8BDB2]'
                  }`}
                >
                  IN
                </button>

                <button
                  onClick={() => setBodyUnit('CM')}
                  className={`w-8 h-8 rounded-full text-xs ${
                    bodyUnit === 'CM'
                      ? 'bg-[#281000] text-white'
                      : 'border border-[#C8BDB2]'
                  }`}
                >
                  CM
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* COLUMN 3 */}

    <div className="px-5 pb-8 lg:border-r lg:border-[#D5C9C0]">

      <h3 className="font-semibold text-[16px] text-[#2A221E] mb-6">
        Length Measurements
      </h3>

      <div className="space-y-5">

        {[
          "Shoulder Width",
          "Chest Width (Front)",
          "Top Length / Blouse Length",
          "Skirt / Dress Length",
          "Back Length",
        ].map((field) => (

          <div key={field}>

            <label className="block mb-2 text-sm text-[#2A221E]">
              {field}
            </label>

            <div className="relative">

              <input
                placeholder="e.g. 15 inches"
                className="w-full h-[46px] rounded-[16px] border border-[#C8BDB2] pl-4 pr-20 bg-[#FFFDFC] placeholder:text-[#AE9D9F]"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">

                <button
                  onClick={() => setLengthUnit('IN')}
                  className={`w-8 h-8 rounded-full text-xs ${
                    lengthUnit === 'IN'
                      ? 'bg-[#281000] text-white'
                      : 'border border-[#C8BDB2]'
                  }`}
                >
                  IN
                </button>

                <button
                  onClick={() => setLengthUnit('CM')}
                  className={`w-8 h-8 rounded-full text-xs ${
                    lengthUnit === 'CM'
                      ? 'bg-[#281000] text-white'
                      : 'border border-[#C8BDB2]'
                  }`}
                >
                  CM
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

    {/* COLUMN 4 */}

    <div className="px-5 pb-8">

      <h3 className="font-semibold text-[16px] text-[#2A221E] mb-6">
        Preferred Fit
      </h3>

      <div className="space-y-7">

        {/* TOP FIT */}

        <div>
          <p className="mb-3 text-sm  text-[#2A221E]">Fit Preference for Top</p>

          <div className="flex flex-wrap gap-2">
            {['Fitted','Semi-Fitted','Relaxed / Loose'].map((item)=>(
              <button
                key={item}
                onClick={()=>setTopFit(item)}
                className={`px-5 py-2 rounded-full border ${
                  topFit === item
                    ? 'bg-[#281000] text-white border-[#281000]'
                    : 'bg-white text-black border-[#C8BDB2]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM FIT */}

        <div>
          <p className="mb-3 text-sm  text-[#2A221E]">Fit Preference for Bottom</p>

          <div className="flex flex-wrap gap-2">
            {['Fitted','Semi-Fitted','Relaxed / Loose'].map((item)=>(
              <button
                key={item}
                onClick={()=>setBottomFit(item)}
                className={`px-5 py-2 rounded-full border ${
                  bottomFit === item
                    ? 'bg-[#281000] text-white border-[#281000]'
                    : 'bg-white text-black border-[#C8BDB2]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* WAISTBAND */}

        <div>
          <p className="mb-3 text-sm  text-[#2A221E]">Waistband Preference</p>

          <div className="flex flex-wrap gap-2">
            {['Elasticated','Fixed'].map((item)=>(
              <button
                key={item}
                onClick={()=>setWaistBand(item)}
                className={`px-5 py-2 rounded-full border ${
                  waistBand === item
                    ? 'bg-[#281000] text-white border-[#281000]'
                    : 'bg-white text-black border-[#C8BDB2]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BACK STYLE */}

        <div>
          <p className="mb-3 text-sm  text-[#2A221E]">Back Style Preference</p>

          <div className="flex flex-wrap gap-2">
            {['Open Back','Partially Open','Fully Covered'].map((item)=>(
              <button
                key={item}
                onClick={()=>setBackStyle(item)}
                className={`px-5 py-2 rounded-full border ${
                  backStyle === item
                    ? 'bg-[#281000] text-white border-[#281000]'
                    : 'bg-white text-black border-[#C8BDB2]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>

  </div>

</div>
{/* PRICE SECTION */}

<div className="mt-6 py-6">

  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

    {/* Prices */}
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 lg:gap-16">

      <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#6F625A]">
          Product Price
        </span>

        <span className="text-[28px] font-semibold text-[#0E0E0E]">
          ₹1,011.00
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#6F625A]">
          Customization Price
        </span>

        <span className="text-[28px] font-semibold text-[#0E0E0E]">
          ₹149.00
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#6F625A]">
          Total Amount
        </span>

        <span className="text-[28px] font-semibold text-[#0E0E0E]">
          ₹1,160.00
        </span>
      </div>

    </div>

    {/* Button */}
    <button className="w-full lg:w-auto min-w-[280px] h-[56px] px-8 rounded-full bg-[#281000] text-white font-semibold text-[16px] hover:opacity-90 transition">
      Pay ₹1,160 & Place Order →
    </button>

  </div>

</div>

    {/* ================= HOW TO MEASURE ================= */}

{/* ================= HOW TO MEASURE ================= */}

<div className="mt-8 border-t border-[#D5C9C0] pt-12">

  <h2 className="text-[24px] md:text-[30px] font-semibold text-[#0E0E0E] mb-10">
    How to Measure
  </h2>

  <div className="grid lg:grid-cols-2 gap-10 lg:gap-0">

    {/* ================= LEFT COLUMN ================= */}

    <div className="lg:border-r border-[#D5C9C0] lg:pr-12">

      <h3 className="font-semibold text-[#0E0E0E] text-[18px] mb-8">
        Body Measurements
      </h3>

      {[
        {
          img: "/retail/newArrivals/8.png",
          title: "Height",
          desc: "Stand straight against a wall without footwear. Measure from the floor to the top of your head."
        },
        {
          img: "/retail/newArrivals/9.png",
          title: "Bust / Breast Size",
          desc: "Wrap the tape around the fullest part of your chest, across your nipple line. Keep the tape parallel to the floor."
        },
        {
          img: "/retail/newArrivals/10.png",
          title: "Waist",
          desc: "Measure around the narrowest part of your natural waist, usually just above your belly button."
        },
        {
          img: "/retail/newArrivals/11.png",
          title: "Belly / Tummy Size",
          desc: "Measure around the fullest part of your belly, usually 2–3 inches below the belly button."
        },
        {
          img: "/retail/newArrivals/12.png",
          title: "Hip Size",
          desc: "Measure around the fullest part of your hips and seat area."
        }
      ].map((item, index) => (

        <div
          key={index}
          className="flex gap-5 mb-10 items-start"
        >
          <div className="relative w-[70px] h-[90px] flex-shrink-0">
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h4 className="font-semibold text-[#0E0E0E] mb-2">
              {item.title} :
            </h4>

            <p className="text-[#5E524A] leading-7 text-sm md:text-[15px]">
              {item.desc}
            </p>
          </div>
        </div>

      ))}

    </div>

    {/* ================= RIGHT COLUMN ================= */}

    <div className="lg:pl-12">

      <h3 className="font-semibold text-[#0E0E0E] text-[18px] mb-8">
        Length Measurements
      </h3>

      {[
        {
          img: "/retail/newArrivals/13.png",
          title: "Shoulder Width",
          desc: "Measure from the tip of one shoulder across the back to the tip of the other shoulder."
        },
        {
          img: "/retail/newArrivals/14.png",
          title: "Chest Width (Front)",
          desc: "Measure across the front of your chest from armhole to armhole."
        },
        {
          img: "/retail/newArrivals/15.png",
          title: "Top Length / Blouse Length",
          desc: "Measure from the highest point of your shoulder down to where you want the garment to end."
        },
        {
          img: "/retail/newArrivals/16.png",
          title: "Skirt / Dress Length",
          desc: "Measure from your natural waist down to the desired hem length."
        },
        {
          img: "/retail/newArrivals/17.png",
          title: "Inseam / Trouser Length",
          desc: "Measure from your crotch down to your ankle along the inside of the leg."
        },
        {
          img: "/retail/newArrivals/18.png",
          title: "Back Length",
          desc: "Measure from the base of your neck straight down to your natural waist."
        }
      ].map((item, index) => (

        <div
          key={index}
          className="flex gap-5 mb-10 items-start"
        >
          <div className="relative w-[70px] h-[90px] flex-shrink-0">
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h4 className="font-semibold text-[#0E0E0E] mb-2">
              {item.title} :
            </h4>

            <p className="text-[#5E524A] leading-7 text-sm md:text-[15px]">
              {item.desc}
            </p>
          </div>
        </div>

      ))}

    </div>

  </div>

</div> 
      </div>
    </div>
     <div className="bg-[#FFF7F2] min-h-screen pb-20">
      {/* TERA PURA EXISTING CODE */}
    </div>

   

   <CheckoutDrawer
  open={buyNowOpen}
  onClose={() => setBuyNowOpen(false)}
  product={buyNowProduct}
/>
  </>
  );
};

export default ProductDetailPage;