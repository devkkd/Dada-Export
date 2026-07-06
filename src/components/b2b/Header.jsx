// components/Header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
const [mobileMenuOpen, setMobileMenuOpen] =
  useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
        '/b2b/cart'
      ) {
        window.location.href =
          '/b2b/checkout';
      } else {
        router.push('/b2b/account');
      }

    } else {
      alert('Invalid Number');
    }
  };

  return (
    <header className="bg-[#95565E] text-white">
     <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
       <div className="flex items-center justify-between h-[72px] md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/b2b/logo.png"
                alt="DADA EXPORTS"
                width={100}
                height={100}
             
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/b2b/new-arrival" className="hover:text-white/80 transition-colors">
              New Arrival
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('dress')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href="/b2b/dress"
                className="hover:text-white/80 transition-colors"
              >
                Dresses
              </Link>

              {openMenu === 'dress' && (
  <div className="absolute left-0 top-full pt-5 z-[99999]">
    <div
      className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD] relative z-[99999]"
    >

      <Link
        href="/b2b/maxi-dress"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Maxi Dress
      </Link>

      <Link
        href="/b2b/midi-dress"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Midi Dress
      </Link>

      <Link
        href="/b2b/short-dress"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
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
              <Link href="/b2b/top">
                Tops
              </Link>

              {openMenu === 'tops' && (
  <div className="absolute left-0 top-full pt-5 z-[99999]">
    <div
      className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD] relative z-[99999]"
    >

      <Link
        href="/b2b/crop-top"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Crop Tops
      </Link>

      <Link
        href="/b2b/shirts"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Shirts
      </Link>

      <Link
        href="/b2b/tshirts"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
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
              <Link href="/b2b/bottom-wear">
                Bottom Wear
              </Link>

            {openMenu === 'bottom' && (
  <div className="absolute left-0 top-full pt-5 z-[99999]">
    <div
      className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD] relative z-[99999]"
    >

      <Link
        href="/b2b/pants"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Pants
      </Link>

      <Link
        href="/b2b/skirts"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Skirts
      </Link>

      <Link
        href="/b2b/shorts"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Shorts
      </Link>

    </div>
  </div>
)}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('accessories')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link href="/b2b/accessories">
                Accessories
              </Link>

              {openMenu === 'accessories' && (
  <div className="absolute left-0 top-full pt-5 z-[99999]">
    <div
      className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD] relative z-[99999]"
    >

      <Link
        href="/b2b/bags"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Bags
      </Link>

      <Link
        href="/b2b/purses"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Purses
      </Link>

      <Link
        href="/b2b/toiletry-bags"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Toiletry Bags
      </Link>

    </div>
  </div>
)}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('home')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link href="/b2b/home-lifestyle">
                Home & Lifestyle
              </Link>

             {openMenu === 'home' && (
  <div className="absolute left-0 top-full pt-5 z-[99999]">
    <div
      className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD] relative z-[99999]"
    >

      <Link
        href="/b2b/yoga-mats"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Yoga Mats
      </Link>

      <Link
        href="/b2b/sofa-covers"
        className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F1F1] hover:bg-[#E8DCE0]"
        style={{ color: '#000' }}
      >
        Sofa Covers
      </Link>

    </div>
  </div>
)}
            </div>
            <Link href="/b2b/process" className="hover:text-white/80 transition-colors">
              Process
            </Link>
            <Link href="/b2b/about" className="hover:text-white/80 transition-colors">
              About
            </Link>
            <Link href="/b2b/contactUs" className="hover:text-white/80 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Right Side: Search + Icons */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Search Bar */}
           <div className="hidden lg:flex items-center w-[180px] border-b border-white/70 pb-1">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[14px] text-white placeholder:text-white/80 w-full"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white flex-shrink-0 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {/* Mobile Search Icon */}
<button
  onClick={() => setMobileSearchOpen(true)}
  className="lg:hidden text-white"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
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
</button>

            {/* User Icon */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  router.push('/b2b/account');
                } else {
                  setShowLogin(true);
                }
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link
              href="/b2b/cart"
              className="text-white hover:text-white/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
height="24"
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

            {/* Mobile Menu Button (optional) */}
           <button
  onClick={() =>
    setMobileMenuOpen(
      !mobileMenuOpen
    )
  }
  className="md:hidden text-white"
>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  {mobileSearchOpen && (
  <div className="fixed top-0 left-0 right-0 z-[99999]">

    {/* Search Header */}
    <div className="bg-[#95565E] h-[72px] px-4 flex items-center shadow-lg">

      <div className="flex items-center gap-3 w-full">

        <input
          autoFocus
          type="text"
          placeholder="Search Products..."
          className="flex-1 h-10 rounded-full px-4 bg-white text-black text-sm outline-none"
        />

        <button
          onClick={() => setMobileSearchOpen(false)}
          className="text-white text-3xl leading-none"
        >
          ×
        </button>

      </div>

    </div>

    {/* Overlay */}
    <div
      className="fixed inset-0 top-[72px] bg-black/40"
      onClick={() => setMobileSearchOpen(false)}
    />

  </div>
)}
{mobileMenuOpen && (
 <div className="md:hidden bg-[#95565E] border-t border-white/10 shadow-xl">

 <div className="px-4 py-1 flex flex-col max-h-[42vh] overflow-y-auto">

     <Link
  href="/b2b/new-arrival"
  onClick={() => setMobileMenuOpen(false)}
 className="py-1.5 border-b border-white/10 text-[13px]"
>
  New Arrival
</Link>

<Link
  href="/b2b/dress"
  onClick={() => setMobileMenuOpen(false)}
className="py-1.5 border-b border-white/10 text-[13px]"
>
  Dresses
</Link>

<Link
  href="/b2b/top"
  onClick={() => setMobileMenuOpen(false)}
 className="py-1.5 border-b border-white/10 text-[13px]"
>
  Tops
</Link>

<Link
  href="/b2b/bottom-wear"
  onClick={() => setMobileMenuOpen(false)}
className="py-1.5 border-b border-white/10 text-[13px]"
>
  Bottom Wear
</Link>

<Link
  href="/b2b/accessories"
  onClick={() => setMobileMenuOpen(false)}
className="py-1.5 border-b border-white/10 text-[13px]"
>
  Accessories
</Link>

<Link
  href="/b2b/home-lifestyle"
  onClick={() => setMobileMenuOpen(false)}
 className="py-1.5 border-b border-white/10 text-[13px]"
>
  Home & Lifestyle
</Link>

<Link
  href="/b2b/process"
  onClick={() => setMobileMenuOpen(false)}
  className="py-1.5 border-b border-white/10 text-[13px]"
>
  Process
</Link>

<Link
  href="/b2b/about"
  onClick={() => setMobileMenuOpen(false)}
className="py-1.5 border-b border-white/10 text-[13px]"
>
  About
</Link>

<Link
  href="/b2b/contactUs"
  onClick={() => setMobileMenuOpen(false)}
 className="py-2 text-[14px]"
>
  Contact Us
</Link>

    </div>

  </div>
)}
      {/* Optional thin bottom border to match exact design */}
    
      {/* Thin bottom border */}
      <div className="h-px bg-white/20" />

      {showLogin && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md">

          <div className="relative w-[480px] max-w-[90vw]    bg-[#FFFEF9] rounded-[36px] overflow-hidden shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute right-8 top-6 text-black text-[34px] z-10"
            >
              ×
            </button>

            {/* Logo Area */}
            <div className="flex justify-center items-center h-[270px]">

              <Image
                src="/b2b/footerlogo.png"
                alt="Iveara"
                width={280}
                height={100}
                priority
                className="object-contain"
              />

            </div>

            {/* Divider */}
            <div className="border-t border-[#D8C8BC] " />

            {/* Login Area */}
            <div className="px-10 py-12">

              <div className="flex h-[56px] border border-[#CDBEB5] rounded-[20px] overflow-hidden bg-white">

                <div className="flex items-center gap-2 px-4 border-r border-[#CDBEB5] text-black">

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
                  className="bg-[#95565E] text-white px-6 font-semibold"
                >
                  Login
                </button>

              </div>

              <p className="mt-8 text-[15px] leading-8 text-black">
                By proceeding, you are agreeing to our
                <span className="font-semibold"> T&C </span>
                and
                <span className="font-semibold"> Privacy Policy.</span>
              </p>

            </div>

            {/* Divider */}
            <div className="border-t border-[#D8C8BC]" />

            {/* Footer */}
            <div className="py-8 flex items-center justify-center gap-2 text-black">

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