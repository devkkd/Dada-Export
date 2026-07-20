'use client';

import Image     from 'next/image';
import Link      from 'next/link';
import { useState, useEffect } from 'react';
import { useRetailData }        from '@/components/retail/RetailDataContext';
import { useRetailAuth }        from '@/context/RetailAuthContext';
import LoginModal               from '@/components/retail/LoginModel';

export default function HeaderRetail() {
  const { categories }                  = useRetailData();
  const { user, isLoggedIn, isLoading } = useRetailAuth();

  const [openMenu,         setOpenMenu]         = useState(null);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loginModalOpen,   setLoginModalOpen]   = useState(false);

  // Allow other components to trigger login modal via custom event
  useEffect(() => {
    const openLogin = () => {
      setLoginModalOpen(true);
    };
    document.addEventListener('openLoginPopup', openLogin);
    return () => document.removeEventListener('openLoginPopup', openLogin);
  }, []);

  const navCategories = categories.filter((c) => !c.parentId);

  return (
    <header className="bg-[#281000] text-white">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[72px] md:h-20">

          {/* Logo */}
          <Link href="/retail" className="flex items-center">
            <Image src="/retail/Union.png" alt="ivara" width={80} height={80} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <Link href="/retail/new-arrival" className="hover:text-white/80 transition-colors">
              New Arrival
            </Link>

            {navCategories.map((cat) => {
              const subs = cat.subcategories || [];
              return (
                <div
                  key={cat._id}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(cat._id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link href={`/retail/category/${cat.slug}`} className="hover:text-white/80 transition-colors">
                    {cat.name}
                  </Link>

                  {subs.length > 0 && openMenu === cat._id && (
                    <div className="absolute left-0 top-full pt-5 z-[99999]">
                      <div className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD]">
                        {subs.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/retail/category/${cat.slug}?sub=${sub.slug}`}
                            className="block px-6 py-7 text-[18px] font-medium !text-black bg-[#F7F3F1] hover:bg-[#FEE6C3]"
                            style={{ color: '#000' }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link href="/retail/about"     className="hover:text-white/80 transition-colors">About</Link>
            <Link href="/retail/contactUs" className="hover:text-white/80 transition-colors">Support</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">

            {/* Desktop search */}
            <div className="hidden lg:flex items-center w-[180px] border-b border-white/70 pb-1">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[14px] text-white placeholder:text-white/70 w-full"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/80 flex-shrink-0 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile search icon */}
            <button onClick={() => setMobileSearchOpen(true)} className="lg:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User icon — always navigates to /retail/account */}
            {/* Account page has its own auth guard — redirects to login if not authenticated */}
            {!isLoading && isLoggedIn && user ? (
              <Link
                href="/retail/account"
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center w-6 h-6 md:w-7 md:h-7"
                aria-label="My Account"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'Account'}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border-2 border-white/40 w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold border border-white/30">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="rounded-full border border-white/50 px-3 py-2 text-sm text-white/80 hover:text-white hover:border-white transition-colors"
                aria-label="Sign In"
              >
                Sign In
              </button>
            )}

            {/* Cart */}
            <Link href="/retail/cart" className="text-white hover:text-white/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
                <path d="M9 8V6a3 3 0 1 1 6 0v2" />
              </svg>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed top-0 left-0 right-0 z-[99999]">
          <div className="bg-[#281000] h-[72px] px-4 flex items-center shadow-lg">
            <div className="flex items-center gap-3 w-full">
              <input
                autoFocus
                type="text"
                placeholder="Search Products..."
                className="flex-1 h-10 rounded-full px-4 bg-white text-black text-sm outline-none"
              />
              <button onClick={() => setMobileSearchOpen(false)} className="text-white text-3xl leading-none">×</button>
            </div>
          </div>
          <div className="fixed inset-0 top-[72px] bg-black/40" onClick={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#281000] border-t border-white/10 shadow-xl">
          <div className="px-4 py-1 flex flex-col max-h-[42vh] overflow-y-auto">
            <Link href="/retail/new-arrival" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">New Arrival</Link>
            {navCategories.map((cat) => (
              <Link key={cat._id} href={`/retail/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">
                {cat.name}
              </Link>
            ))}
            <Link href="/retail/about"     onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">About</Link>
            <Link href="/retail/contactUs" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">Support</Link>
            {!isLoading && !isLoggedIn && (
              <button onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }} className="py-4 font-medium text-left">Sign In →</button>
            )}
            {!isLoading && isLoggedIn && user && (
              <Link href="/retail/account" onClick={() => setMobileMenuOpen(false)} className="py-4 font-medium">My Account →</Link>
            )}
          </div>
        </div>
      )}

      {/* Bottom border */}
      <div className="h-px bg-white/20" />

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
}
