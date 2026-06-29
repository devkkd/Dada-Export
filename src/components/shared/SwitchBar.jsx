'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function SwitchBar() {
  const pathname = usePathname();

  const isB2B = pathname === '/' || pathname.startsWith('/b2b');
  const isRetail = pathname.startsWith('/retail') || pathname.startsWith('/ivara');

  return (
    <div className="w-full bg-[#FFFEF9] py-[4px]">
      <div className="w-full">
        <div className="flex gap-[6px] w-full">
          
          {/* B2B Tab - DADA EXPORTS */}
          <Link
            href="/b2b"
            className="flex-1 h-[58px] sm:h-[70px] rounded-l-[0px] rounded-r-[50px] flex items-center justify-center text-[13px] sm:text-[14px] font-semibold bg-[#95565E] text-white shadow-sm"
          >
            <>
              <span className="text-[16px] sm:text-[16px] font-semibold">
                DADA EXPORTS
              </span>
              <span className="hidden sm:inline"> - B2B Wholesale & Bulk</span>
              <span className="font-normal ml-1 sm:ml-2 text-xs sm:text-sm">
                (For Business)
              </span>
            </>
          </Link>

          {/* Retail Tab - ivara */}
          <Link
            href="/retail"
            className="flex-1 h-[58px] sm:h-[70px] rounded-l-[50px] rounded-r-[0px] flex items-center justify-center text-[13px] sm:text-[14px] font-semibold bg-[#281000] text-white shadow-sm"
          >
            <>
              <Image
                src="/retail/Union.png"
                alt="Iveara"
                width={80}
                height={22}
                className="w-auto h-5 sm:h-6 mr-2 object-contain -mt-1 sm:-mt-2"
              />
              <span className="hidden sm:inline">Retail & Customization</span>
              <span className="sm:hidden">Retail</span>
              
              <span className="font-normal ml-1 text-xs sm:text-sm">
                (For Customer)
              </span>
            </>
          </Link>

        </div>
      </div>
    </div>
  );
}