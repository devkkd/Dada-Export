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
        <div className="flex gap-1 sm:gap-[6px] w-full">
          
          {/* B2B Tab - DADA EXPORTS */}
          <Link
            href="/b2b"
            style={{ color: '#ffffff' }}
            className="flex-1 h-[52px] sm:h-[70px] rounded-r-[35px] sm:rounded-r-[50px] bg-[#95565E] !text-white shadow-sm flex flex-col sm:flex-row items-center justify-center px-2"
          >
            <span style={{ color: '#ffffff' }} className="text-[12px] sm:text-[16px] font-semibold leading-none !text-white">
              DADA EXPORTS
            </span>

            <span style={{ color: '#ffffff' }} className="hidden lg:inline ml-2 text-[14px] !text-white">
              - B2B Wholesale & Bulk
            </span>

            <span style={{ color: '#ffffff' }} className="text-[9px] sm:text-xs font-normal sm:ml-2 leading-none mt-0.5 sm:mt-0 !text-white">
              (For Business)
            </span>
          </Link>
          {/* Retail Tab - ivara */}
          <Link
            href="/retail"
            style={{ color: '#ffffff' }}
            className="flex-1 h-[52px] sm:h-[70px] rounded-l-[35px] sm:rounded-l-[50px] bg-[#281000] !text-white shadow-sm flex flex-col sm:flex-row items-center justify-center px-2"
          >
            <div className="flex items-center justify-center gap-1 min-w-0">
              <Image
                src="/retail/Union.png"
                alt="Iveara"
                width={70}
                height={20}
                className="h-4 sm:h-6 w-auto mr-1 sm:mr-2 object-contain flex-shrink-0"
              />

              <span style={{ color: '#ffffff' }} className="hidden lg:inline text-[14px] relative top-[3px] !text-white">
                Retail & Customization
              </span>

              <span style={{ color: '#ffffff' }} className="lg:hidden text-[11px] font-semibold whitespace-nowrap relative top-[2px] !text-white">
                Retail
              </span>
            </div>

            <span style={{ color: '#ffffff' }} className="relative top-[3px] text-[9px] sm:text-xs font-normal mt-0.5 sm:mt-0 sm:ml-2 !text-white">
              (For Customer)
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}