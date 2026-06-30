'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsAppButton() {
  const handleClick = () => {
    window.open(
      'https://wa.me/919999999999?text=Hello%20I%20am%20interested%20in%20B2B%20Enquiry',
      '_blank'
    );
  };

  return (
    <div
      className="fixed right-2 md:right-4 lg:right-5 top-[68%] -translate-y-1/2 z-[9999]"
    >
      <button
        onClick={handleClick}
        aria-label="WhatsApp B2B Enquiry"
        className="flex items-center justify-center gap-2 bg-[#08C943] text-white rounded-full shadow-xl h-[46px] px-4 md:h-[54px] md:px-5 lg:h-[56px] lg:px-5 hover:scale-[1.02] transition-all duration-300"
      >
         <FaWhatsapp
          className="text-[20px] md:text-[24px] lg:text-[26px] shrink-0"
        /> 

        <span
          className="font-semibold whitespace-nowrap leading-none text-[12px] md:text-[15px] lg:text-[16px]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          B2B Enquiry
        </span>
      </button>
    </div>
  );
}