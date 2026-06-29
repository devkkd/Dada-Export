// components/HeaderRetail.tsx  (or Header.tsx for retail section)

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function HeaderRetail() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('accountLogin');

    if (logged === 'true') {
      setIsLoggedIn(true);
    }

    const openLogin = () => {
      setShowLogin(true);
    };

    document.addEventListener(
      'openLoginPopup',
      openLogin
    );

    return () => {
      document.removeEventListener(
        'openLoginPopup',
        openLogin
      );
    };
  }, []);
  const handleLogin = () => {
    if (mobile === '9999999999') {

      localStorage.setItem(
        'accountLogin',
        'true'
      );

      setIsLoggedIn(true);
      setShowLogin(false);

      if (
        window.location.pathname ===
        '/retail/cart'
      ) {
        window.location.href =
          '/retail/checkout';
      } else {
        router.push('/retail/account');
      }

    } else {
      alert('Invalid Number');
    }
  };
  return (
    <header className="bg-[#281000] text-white">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* Logo - ivara */}
          <div className="flex items-center">
            <Link href="/retail" className="flex items-center">
              <Image
                src="/retail/Union.png"
                alt="ivara"
                width={140}
                height={50}
                priority
                className="h-[42px] md:h-[48px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <Link href="/retail/new-arrival" className="hover:text-white/80 transition-colors">
              New Arrival
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('dress')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href="/retail/dress"
                className="hover:text-white/80 transition-colors"
              >
                Dresses
              </Link>

              {openMenu === 'dress' && (
                <div className="absolute left-0 top-full pt-5 z-[99999]">
                  <div className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD]">

                    <Link
                      href="/retail/dress/maxi-dress"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Maxi Dress
                    </Link>

                    <Link
                      href="/retail/dress/midi-dress"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Midi Dress
                    </Link>

                    <Link
                      href="/retail/dress/short-dress"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Short Dress
                    </Link>

                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('tops')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href="/retail/top"
                className="hover:text-white/80 transition-colors"
              >
                Tops
              </Link>

              {openMenu === 'tops' && (
                <div className="absolute left-0 top-full pt-5 z-[99999]">
                  <div className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD]">

                    <Link
                      href="/retail/crop-top"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Crop Tops
                    </Link>

                    <Link
                      href="/retail/shirts"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Shirts
                    </Link>

                    <Link
                      href="/retail/tshirts"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      T-Shirts
                    </Link>

                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('bottom')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href="/retail/bottom-wear"
                className="hover:text-white/80 transition-colors"
              >
                Bottom Wear
              </Link>

              {openMenu === 'bottom' && (
                <div className="absolute left-0 top-full pt-5 z-[99999]">
                  <div className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD]">

                    <Link
                      href="/retail/pants"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Pants
                    </Link>

                    <Link
                      href="/retail/skirts"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Skirts
                    </Link>

                    <Link
                      href="/retail/shorts"
                      className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                    >
                      Shorts
                    </Link>

                  </div>
                </div>
              )}
            </div>
            <Link href="/retail/mens" className="hover:text-white/80 transition-colors">
              Men&apos;s
            </Link>
            <Link href="/retail/kidds" className="hover:text-white/80 transition-colors">
              Kidd&apos;s
            </Link>
            {/*<Link href="/retail/process" className="hover:text-white/80 transition-colors">
              Process
            </Link>*/}
            <Link href="/retail/about" className="hover:text-white/80 transition-colors">
              About
            </Link>
            <Link href="/retail/contactUs" className="hover:text-white/80 transition-colors">
              Support
            </Link>
          </nav>

          {/* Right Side: Search + Icons */}
          <div className="flex items-center gap-5 md:gap-6">

            {/* Search Bar */}
            <div className="flex items-center w-[160px] md:w-[200px] lg:w-[240px] border-b border-white/60 pb-1 transition-all">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[14px] text-white placeholder:text-white/70 w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white/80 flex-shrink-0 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* User Icon */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  router.push('/retail/account');
                } else {
                  setShowLogin(true);
                }
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
              </svg>

            </button>


            {/* Cart Icon */}
            <Link
              href="/retail/cart"
              className="text-white hover:text-white/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
                <path d="M9 8V6a3 3 0 1 1 6 0v2" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
           <button
  onClick={() =>
    setMobileMenuOpen(
      !mobileMenuOpen
    )
  }
  className="lg:hidden text-white"
>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
{mobileMenuOpen && (
  <div className="lg:hidden bg-[#281000] border-t border-white/20">

    <div className="px-6 py-6 flex flex-col">

      <Link
        href="/retail/new-arrival"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        New Arrival
      </Link>

      <Link
        href="/retail/dress"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Dresses
      </Link>

      <Link
        href="/retail/top"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Tops
      </Link>

      <Link
        href="/retail/bottom-wear"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Bottom Wear
      </Link>

      <Link
        href="/retail/mens"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Men's
      </Link>

      <Link
        href="/retail/kidds"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Kidd's
      </Link>

      {/*<Link
        href="/retail/process"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        Process
      </Link>*/}

      <Link
        href="/retail/about"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4 border-b border-white/10"
      >
        About
      </Link>

      <Link
        href="/retail/contactUs"
        onClick={() => setMobileMenuOpen(false)}
        className="py-4"
      >
        Support
      </Link>

    </div>

  </div>
)}
      {/* Thin bottom border */}
      <div className="h-px bg-white/20" />

      {showLogin && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md">

          <div className="relative w-[480px] max-w-[90vw]   bg-[#FDF8F4] rounded-[36px] overflow-hidden shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute right-8 top-6 text-[#281000] text-[34px] z-10"
            >
              ×
            </button>

            {/* Logo Area */}
            <div className="flex justify-center items-center h-[270px]">

              <Image
                src="/retail/footerlogo.png"
                alt="Iveara"
                width={280}
                height={100}
                priority
                className="object-contain"
              />

            </div>

            {/* Divider */}
            <div className="border-t border-[#D8C8BC]" />

            {/* Login Area */}
            <div className="px-10 py-12">

              <div className="flex h-[56px] border border-[#CDBEB5] rounded-[20px] overflow-hidden bg-white">

                <div className="flex items-center gap-2 px-4 border-r border-[#CDBEB5] text-[#281000]">

                  <span>🇮🇳</span>
                  <span>+91</span>

                </div>

                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-Digit mobile number"
                  className="flex-1 px-4 outline-none text-[#281000] placeholder:text-[#B9AFA9]"
                />

                <button
                  onClick={handleLogin}
                  className="bg-[#281000] text-white px-6 font-semibold"
                >
                  Login
                </button>

              </div>

              <p className="mt-8 text-[15px] leading-8 text-[#281000]">
                By proceeding, you are agreeing to our
                <span className="font-semibold"> T&C </span>
                and
                <span className="font-semibold"> Privacy Policy.</span>
              </p>

            </div>

            {/* Divider */}
            <div className="border-t border-[#D8C8BC]" />

            {/* Footer */}
            <div className="py-8 flex items-center justify-center gap-2 text-[#281000]">

              <span className="tracking-wide">
                POWERED BY
              </span>

              <img
                src="/retail/newArrivals/19.png"
                alt="Shiprocket"
                className="h-6"
              />

            </div>

          </div>

        </div>
      )}
    </header>
  );
}