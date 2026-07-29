'use client';

/**
 * RetailAuthContext
 *
 * Manages retail customer session using the custom HttpOnly JWT cookie
 * (/api/retail/auth/me handles both email-OTP and Google OAuth users).
 *
 * We no longer use NextAuth SessionProvider here — it was causing 404s on
 * /api/retail/auth/session due to Turbopack catch-all route conflicts with
 * named sibling folders. Our /api/retail/auth/me already supports both auth
 * methods and is the single source of truth.
 *
 * Google OAuth callback → NextAuth sets retail-next-auth.session-token cookie
 * → /api/retail/auth/me reads it via getToken() and returns the user.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

const RetailAuthContext = createContext({
  user:             null,
  status:           'loading',
  isLoggedIn:       false,
  isLoading:        true,
  localCartSynced:  false,
  cartCount:        0,
  refreshCartCount: async () => {},
  logout:           async () => {},
  refreshUser:      async () => {},
});

export function RetailAuthProvider({ children }) {
  const [user,           setUser]           = useState(null);
  const [status,         setStatus]         = useState('loading');
  const [localCartSynced, setLocalCartSynced] = useState(false);
  const [cartCount,       setCartCount]       = useState(0);

  // ── Fetch current user from our unified /me endpoint ─────────────────────
  const fetchUser = useCallback(async () => {
    try {
      const res  = await fetch('/api/retail/auth/me', { credentials: 'include' });
      if (process.env.NODE_ENV === 'development') console.debug('[RetailAuth] /me status', res.status);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setStatus('authenticated');
          try { if (typeof window !== 'undefined') localStorage.setItem('accountLogin', 'true'); } catch (e) { /* ignore */ }
          return;
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          try { const txt = await res.text(); console.debug('[RetailAuth] /me body', txt); } catch {};
        }
      }
    } catch { /* network error */ }
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await fetch('/api/retail/cart', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const count = (json.data.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(count);
          return;
        }
      }
    } catch (e) {
      console.error('Error refreshing cart count:', e);
    }
    setCartCount(0);
  }, []);

  const syncLocalCartToServer = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const rawCart = localStorage.getItem('cart');
    if (!rawCart) {
      setLocalCartSynced(true);
      return;
    }

    let items = [];
    try {
      items = JSON.parse(rawCart) || [];
    } catch {
      items = [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      setLocalCartSynced(true);
      return;
    }

    const payload = {
      items: items
        .filter((item) => item && (item.id || item.productId) && item.quantity > 0)
        .map((item) => ({
          productId: item.productId || item.id,
          size:       item.size,
          color:      item.color,
          quantity:   item.quantity || 1,
        })),
    };

    if (payload.items.length === 0) {
      setLocalCartSynced(true);
      return;
    }

    try {
      const res = await fetch('/api/retail/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem('cart');
      }
    } catch {
      // Keep guest cart intact if merge fails; retry later.
    } finally {
      setLocalCartSynced(true);
    }
  }, []);

  // Load on mount + re-check on tab focus
  useEffect(() => {
    fetchUser();
    const onFocus = () => fetchUser();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchUser]);

  useEffect(() => {
    if (status === 'authenticated') {
      refreshCartCount();
    } else {
      setCartCount(0);
    }
  }, [status, refreshCartCount]);

  useEffect(() => {
    if (status === 'authenticated' && !localCartSynced) {
      syncLocalCartToServer().then(() => refreshCartCount());
    }
  }, [status, localCartSynced, syncLocalCartToServer, refreshCartCount]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    // Clear our custom JWT cookie
    try {
      await fetch('/api/retail/auth/logout', { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }

    // Also clear NextAuth session cookie (Google OAuth) via direct cookie clear
    // We can't call /api/retail/auth/signout because of the catch-all 404 issue,
    // so we redirect to a logout URL that NextAuth handles via the catch-all
    setUser(null);
    setStatus('unauthenticated');
    setLocalCartSynced(false);
    setCartCount(0);
    try { if (typeof window !== 'undefined') localStorage.removeItem('accountLogin'); } catch (e) { /* ignore */ }
    window.location.href = '/retail';
  };

  const isLoggedIn = status === 'authenticated';
  const isLoading  = status === 'loading';

  return (
    <RetailAuthContext.Provider
      value={{ user, status, isLoggedIn, isLoading, localCartSynced, cartCount, refreshCartCount, logout, refreshUser: fetchUser }}
    >
      {children}
    </RetailAuthContext.Provider>
  );
}

export function useRetailAuth() {
  return useContext(RetailAuthContext);
}
