'use client';

import Image     from 'next/image';
import Link      from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRetailData }        from '@/components/retail/RetailDataContext';
import { useRetailAuth }        from '@/context/RetailAuthContext';
import LoginModal               from '@/components/retail/LoginModel';

export default function HeaderRetail() {
  const { categories, allProducts }                  = useRetailData();
  const { user, isLoggedIn, isLoading, cartCount } = useRetailAuth();
  const router = useRouter();

  const [openMenu,         setOpenMenu]         = useState(null);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loginModalOpen,   setLoginModalOpen]   = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  // Allow other components to trigger login modal via custom event
  useEffect(() => {
    const openLogin = () => {
      setLoginModalOpen(true);
    };
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
      router.push(`/retail/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
            <form onSubmit={handleSearchSubmit} ref={searchRef} className="hidden lg:flex items-center w-[180px] border-b border-white/70 pb-1 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                className="bg-transparent outline-none text-[14px] text-white placeholder:text-white/70 w-full"
              />
              <button type="submit" aria-label="Search" className="text-white/80 hover:text-white transition-colors focus:outline-none flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                            href={`/retail/product/${product.slug}`}
                            onClick={() => setShowResults(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-[#FEE6C3]/40 transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={product.images?.[0] || '/retail/newArrivals/1.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-[#281000] truncate">{product.name}</p>
                              <p className="text-[11px] text-[#281000]/60 truncate">
                                {product.sku || 'Retail Product'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-[#E5D9DD] bg-[#FFF7F2] p-2 text-center">
                        <button
                          type="submit"
                          className="text-[12px] font-bold text-[#281000] hover:underline"
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
                className="rounded-full px-3 py-2 text-sm  transition-colors"
                aria-label="Sign In"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
                             </svg>
              </button>
            )}

            {/* Cart */}
            <Link href="/retail/cart" className="text-white hover:text-white/80 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
                <path d="M9 8V6a3 3 0 1 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#FEE6C3] text-[#281000] text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-[#281000]">
                  {cartCount}
                </span>
              )}
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
                        href={`/retail/product/${product.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery('');
                          setFilteredProducts([]);
                        }}
                        className="flex items-center gap-4 px-6 py-3 border-b border-[#E5D9DD]/50 hover:bg-[#FEE6C3]/40 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={product.images?.[0] || '/retail/newArrivals/1.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-bold text-[#281000] truncate">{product.name}</p>
                          <p className="text-[12px] text-[#281000]/60 truncate">
                            {product.sku || 'Retail Product'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-[#FFF7F2] p-3 text-center border-t border-[#E5D9DD]">
                    <button
                      type="button"
                      onClick={(e) => {
                        setMobileSearchOpen(false);
                        handleSearchSubmit(e);
                        setSearchQuery('');
                        setFilteredProducts([]);
                      }}
                      className="text-sm font-bold text-[#281000] hover:underline"
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
        <div className="md:hidden bg-[#281000] border-t border-white/10 shadow-xl">
          <div className="px-4 py-1 flex flex-col max-h-[42vh] overflow-y-auto">
            <Link href="/retail/new-arrival" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">New Arrival</Link>
            {navCategories.map((cat) => (
              <Link key={cat._id} href={`/ivear/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-white/10">
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
