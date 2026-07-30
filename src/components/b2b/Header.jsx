'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useB2BData } from '@/components/b2b/B2BDataContext';

export default function Header() {
  const { categories, allProducts } = useB2BData();
  const router = useRouter();

  const [showLogin, setShowLogin] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accountLogin') === 'true';
    }
    return false;
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const openLogin = () => setShowLogin(true);
    document.addEventListener('openLoginPopup', openLogin);
    return () => document.removeEventListener('openLoginPopup', openLogin);
  }, []);

  // Click outside to close desktop search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      const lower = val.toLowerCase().trim();
      const filtered = (allProducts || []).filter(p => 
        p.name?.toLowerCase().includes(lower) || 
        p.description?.toLowerCase().includes(lower) ||
        p.sku?.toLowerCase().includes(lower)
      );
      setFilteredProducts(filtered);
      setShowResults(true);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setShowResults(false);
      router.push(`/b2b/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = () => {
    if (mobile === '9999999999') {
      localStorage.setItem('accountLogin', 'true');
      setIsLoggedIn(true);
      setShowLogin(false);
      if (window.location.pathname === '/b2b/cart') {
        window.location.href = '/b2b/checkout';
      } else {
        router.push('/b2b/account');
      }
    } else {
      alert('Invalid Number');
    }
  };

  // Top-level nav categories (parentId === null)
  const navCategories = categories.filter((c) => !c.parentId);

  return (
    <header className="bg-[#95565E] text-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px] md:h-20">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/b2b" className="flex items-center">
              <Image src="/b2b/logo.png" alt="DADA EXPORTS" width={100} height={100} />
            </Link>
          </div>

          {/* Desktop Navigation — dynamic from DB */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/b2b/new-arrival" className="hover:text-white/80 transition-colors">
              New Arrival
            </Link>

            {navCategories.map((cat) => {
              const subs = cat.subcategories || [];
              const href = `/b2b/category/${cat.slug}`;

              return (
                <div
                  key={cat._id}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(cat._id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link href={href} className="hover:text-white/80 transition-colors">
                    {cat.name}
                  </Link>

                  {subs.length > 0 && openMenu === cat._id && (
                    <div className="absolute left-0 top-full pt-5 z-[99999]">
                      <div className="w-[245px] bg-[#F7F3F1] rounded-[18px] overflow-hidden shadow-2xl border border-[#E5D9DD]">
                        {subs.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/b2b/category/${cat.slug}?sub=${sub.slug}`}
                            className="block px-6 py-5 text-[16px] font-medium text-black bg-[#F7F3F1] hover:bg-[#E8DCE0] transition-colors"
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

            <Link href="/b2b/process" className="hover:text-white/80 transition-colors">Process</Link>
            <Link href="/b2b/about" className="hover:text-white/80 transition-colors">About</Link>
            <Link href="/b2b/contactUs" className="hover:text-white/80 transition-colors">Contact Us</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Search Bar desktop */}
            <form onSubmit={handleSearchSubmit} ref={searchRef} className="hidden lg:flex items-center w-[180px] border-b border-white/70 pb-1 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                className="bg-transparent outline-none text-[14px] text-white placeholder:text-white/80 w-full"
              />
              <button type="submit" aria-label="Search" className="text-white focus:outline-none flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Desktop search results dropdown */}
              {showResults && searchQuery.trim().length >= 2 && (
                <div className="absolute right-0 top-full mt-2 w-[300px] bg-[#FFFEF9] border border-[#E5D9DD] rounded-[18px] shadow-2xl z-[99999] overflow-hidden text-black text-left">
                  {filteredProducts.length > 0 ? (
                    <div>
                      <div className="max-h-[280px] overflow-y-auto py-2">
                        {filteredProducts.slice(0, 5).map((product) => (
                          <Link
                            key={product._id}
                            href={`/b2b/product/${product.slug}`}
                            onClick={() => setShowResults(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-[#E8DCE0]/50 transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={product.images?.[0] || '/b2b/home/7.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-[#281000] truncate">{product.name}</p>
                              <p className="text-[11px] text-[#281000]/60 truncate">
                                {product.sku || 'B2B Product'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-[#E5D9DD] bg-[#F7F3F1] p-2 text-center">
                        <button
                          type="submit"
                          className="text-[12px] font-bold text-[#95565E] hover:underline"
                        >
                          View all {filteredProducts.length} results →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-[#281000]/60">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Mobile Search */}
            <button onClick={() => setMobileSearchOpen(true)} className="lg:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User */}
            {/* <button onClick={() => isLoggedIn ? router.push('/b2b/account') : setShowLogin(true)} className="text-white/80 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
              </svg>
            </button> */}

            {/* Cart */}
            <Link href="/b2b/cart" className="text-white hover:text-white/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
                <path d="M9 8V6a3 3 0 1 1 6 0v2" />
              </svg>
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
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
          <div className="bg-[#95565E] h-[72px] px-4 flex items-center shadow-lg">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full relative">
              <input
                autoFocus
                type="text"
                placeholder="Search Products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 h-10 rounded-full px-4 bg-white text-black text-sm outline-none"
              />
              <button type="submit" className="hidden" />
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchQuery('');
                  setFilteredProducts([]);
                }}
                className="text-white text-3xl leading-none"
              >
                ×
              </button>
            </form>
          </div>
          {/* Scrollable results container for mobile search overlay */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute top-[72px] left-0 right-0 max-h-[50vh] overflow-y-auto bg-[#FFFEF9] border-b border-[#E5D9DD] shadow-2xl z-[99998] text-black">
              {filteredProducts.length > 0 ? (
                <div>
                  <div className="py-2">
                    {filteredProducts.slice(0, 8).map((product) => (
                      <Link
                        key={product._id}
                        href={`/b2b/product/${product.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery('');
                          setFilteredProducts([]);
                        }}
                        className="flex items-center gap-4 px-6 py-3 border-b border-[#E5D9DD]/50 hover:bg-[#E8DCE0]/40 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={product.images?.[0] || '/b2b/home/7.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-bold text-[#281000] truncate">{product.name}</p>
                          <p className="text-[12px] text-[#281000]/60 truncate">
                            {product.sku || 'B2B Product'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-[#F7F3F1] p-3 text-center border-t border-[#E5D9DD]">
                    <button
                      type="button"
                      onClick={(e) => {
                        setMobileSearchOpen(false);
                        handleSearchSubmit(e);
                        setSearchQuery('');
                        setFilteredProducts([]);
                      }}
                      className="text-sm font-bold text-[#95565E] hover:underline"
                    >
                      View all {filteredProducts.length} results →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-sm text-[#281000]/60">
                  No products found
                </div>
              )}
            </div>
          )}
          <div
            className="fixed inset-0 top-[72px] bg-black/40 z-[99997]"
            onClick={() => {
              setMobileSearchOpen(false);
              setSearchQuery('');
              setFilteredProducts([]);
            }}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#95565E] border-t border-white/10 shadow-xl">
          <div className="px-4 py-1 flex flex-col max-h-[50vh] overflow-y-auto">
            <Link href="/b2b/new-arrival" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-white/10 text-[13px]">New Arrival</Link>
            {navCategories.map((cat) => (
              <Link key={cat._id} href={`/b2b/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-white/10 text-[13px]">
                {cat.name}
              </Link>
            ))}
            <Link href="/b2b/process" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-white/10 text-[13px]">Process</Link>
            <Link href="/b2b/about" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-white/10 text-[13px]">About</Link>
            <Link href="/b2b/contactUs" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[13px]">Contact Us</Link>
          </div>
        </div>
      )}

      <div className="h-px bg-white/20" />

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md">
          <div className="relative w-[480px] max-w-[90vw] bg-[#FFFEF9] rounded-[36px] overflow-hidden shadow-2xl">
            <button onClick={() => setShowLogin(false)} className="absolute right-8 top-6 text-black text-[34px] z-10">×</button>
            <div className="flex justify-center items-center h-[270px]">
              <Image src="/b2b/footerlogo.png" alt="Dada Exports" width={280} height={100} priority className="object-contain" />
            </div>
            <div className="border-t border-[#D8C8BC]" />
            <div className="px-10 py-12">
              <div className="flex h-[56px] border border-[#CDBEB5] rounded-[20px] overflow-hidden bg-white">
                <div className="flex items-center gap-2 px-4 border-r border-[#CDBEB5] text-black">
                  <span>🇮🇳</span><span>+91</span>
                </div>
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-Digit mobile number" className="flex-1 px-4 outline-none text-[#281000] placeholder:text-[#B9AFA9]" />
                <button onClick={handleLogin} className="bg-[#95565E] text-white px-6 font-semibold">Login</button>
              </div>
              <p className="mt-8 text-[15px] leading-8 text-black">By proceeding, you are agreeing to our <span className="font-semibold">T&C</span> and <span className="font-semibold">Privacy Policy.</span></p>
            </div>
            <div className="border-t border-[#D8C8BC]" />
            <div className="py-8 flex items-center justify-center gap-2 text-black">
              <span className="tracking-wide">POWERED BY</span>
              <img src="/retail/newArrivals/19.png" alt="Shiprocket" className="h-6" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
