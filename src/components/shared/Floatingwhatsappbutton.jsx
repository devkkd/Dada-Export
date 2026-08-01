'use client';

import { useState, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsAppButton() {
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef(null);

  const handleClick = () => {
    window.open(
      'https://wa.me/918209934610?text=Hello%20I%20am%20interested%20in%20B2B%20Enquiry',
      '_blank'
    );
  };

  const handleTouchStart = () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    setExpanded(true);
  };

  const handleTouchEnd = () => {
    // keep expanded briefly after finger lifts, then collapse
    collapseTimer.current = setTimeout(() => setExpanded(false), 1500);
  };

  return (
    <div className="fixed right-2 md:right-4 lg:right-5 top-[88%] -translate-y-1/2 z-[9999]">
      <button
        onClick={handleClick}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="WhatsApp B2B Enquiry"
        className="wa-fab flex items-center justify-center bg-[#08C943] text-white rounded-full shadow-xl h-[46px] md:h-[54px] lg:h-[56px] overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: expanded ? undefined : 'var(--wa-collapsed-w)',
          paddingLeft: expanded ? undefined : 0,
          paddingRight: expanded ? undefined : 0,
        }}
      >
        <span className="flex items-center justify-center gap-2 px-4 md:px-5 lg:px-5 whitespace-nowrap">
          <FaWhatsapp className="text-[20px] md:text-[24px] lg:text-[26px] shrink-0" />

          <span
            className="font-semibold leading-none text-[12px] md:text-[15px] lg:text-[16px] transition-all duration-300 ease-in-out"
            style={{
              maxWidth: expanded ? '200px' : '0px',
              opacity: expanded ? 1 : 0,
              overflow: 'hidden',
              display: 'inline-block',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            B2B Enquiry
          </span>
        </span>
      </button>

      <style jsx>{`
        .wa-fab {
          --wa-collapsed-w: 46px;
        }
        @media (min-width: 768px) {
          .wa-fab {
            --wa-collapsed-w: 54px;
          }
        }
        @media (min-width: 1024px) {
          .wa-fab {
            --wa-collapsed-w: 56px;
          }
        }
      `}</style>
    </div>
  );
}