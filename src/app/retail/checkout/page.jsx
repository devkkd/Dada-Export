'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRetailAuth } from '@/context/RetailAuthContext';
import Image from 'next/image';

const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

export default function RetailCheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useRetailAuth();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/retail/login?callbackUrl=/retail/checkout');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadCheckout = async () => {
      setLoading(true);
      setError('');

      try {
        const [cartRes, addrRes] = await Promise.all([
          fetch('/api/retail/cart', { credentials: 'include' }),
          fetch('/api/retail/auth/addresses', { credentials: 'include' }),
        ]);

        const cartJson = await cartRes.json();
        const addrJson = await addrRes.json();

        if (!cartRes.ok) throw new Error(cartJson.error || 'Unable to load cart');
        if (!addrRes.ok) throw new Error(addrJson.message || 'Unable to load addresses');

        setCart(cartJson.data || { items: [] });
        setAddresses(addrJson.addresses || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load checkout data.');
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [isLoggedIn]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id || '');
        setShippingAddress(defaultAddress);
      }
    }
  }, [addresses]);

  const total = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0,
    [cart]
  );

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    const selected = addresses.find((addr) => addr._id === addressId);
    setShippingAddress(selected || emptyAddress);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please choose a shipping address before placing the order.');
      return;
    }

    setError('');
    setSuccess('');
    setPlacingOrder(true);

    try {
      const res = await fetch('/api/retail/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items || [],
          totalAmount: total,
          shippingAddress,
          paymentId: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to place order');

      setSuccess('Order placed successfully.');
      router.push('/retail/account?tab=orders');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading || (!isLoggedIn && typeof window === 'undefined')) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7F2] min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-3xl font-semibold text-[#281000] mb-6">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 rounded-3xl bg-red-50 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-3xl bg-green-50 text-green-700 border border-green-100">
            {success}
          </div>
        )}

        {loading ? (
          <div className="p-10 rounded-3xl bg-white text-center text-[#281000]/80">Loading checkout details…</div>
        ) : !cart?.items?.length ? (
          <div className="p-12 rounded-3xl bg-white text-center text-[#281000]/80">
            <p className="text-xl font-semibold mb-3">Your cart is empty.</p>
            <p>Add items to your cart before placing an order.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DED8]">
                <h2 className="text-xl font-semibold text-[#281000] mb-4">Shipping Address</h2>

                {addresses.length === 0 ? (
                  <div className="space-y-4 text-[#281000]/80">
                    <p>No saved addresses were found.</p>
                    <p>Please add an address in your account before placing an order.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <label
                        key={address._id}
                        className={`block rounded-3xl border p-4 cursor-pointer transition ${selectedAddressId === address._id ? 'border-[#281000] bg-[#FFF4E6]' : 'border-[#E8DED8] bg-white'}`}
                      >
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={address._id}
                          checked={selectedAddressId === address._id}
                          onChange={() => handleSelectAddress(address._id)}
                          className="mr-3"
                        />
                        <div className="font-semibold text-[#281000] mb-1">{address.label || 'Home'}</div>
                        <div className="text-sm text-[#0E0E0E]/80">
                          {address.name} · {address.phone}
                          <br />
                          {address.street}, {address.city}, {address.state} {address.pincode}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DED8]">
                <h2 className="text-xl font-semibold text-[#281000] mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item._id || `${item.productId}-${item.size}-${item.color}`} className="flex gap-4 rounded-3xl border border-[#E8DED8] p-4">
                      <div className="relative w-[100px] h-[100px] rounded-3xl overflow-hidden border border-[#E8DED8] bg-[#F7F4EF]">
                        <Image
                          src={item.image || '/retail/home/7.png'}
                          alt={item.name || 'Product'}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-[#281000]">{item.name}</div>
                        <div className="text-sm text-[#0E0E0E]/70 mt-2">Size: {item.size || 'N/A'} · Color: {item.color || 'N/A'}</div>
                        <div className="mt-3 flex items-center justify-between gap-4">
                          <div className="text-sm text-[#0E0E0E]/80">Qty: {item.quantity}</div>
                          <div className="text-lg font-semibold text-[#281000]">₹{item.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DED8]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#281000]">Summary</h2>
                <span className="text-sm text-[#0E0E0E]/70">{cart.items.length} items</span>
              </div>

              <div className="space-y-3 text-sm text-[#0E0E0E]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-[#281000] border-t border-[#E8DED8] pt-4">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                disabled={!selectedAddressId || placingOrder || addresses.length === 0}
                onClick={handlePlaceOrder}
                className="mt-8 w-full h-14 rounded-full bg-[#281000] text-white font-semibold transition disabled:bg-[#BDB1A7] disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing Order…' : 'Place Order'}
              </button>

              <p className="mt-4 text-sm text-[#0E0E0E]/70">
                Payment will be completed after order placement. Razorpay and shipping logic will be added later in production.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
