'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRetailAuth } from '@/context/RetailAuthContext';
import Image from 'next/image';
import Script from 'next/script';

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

  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

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
    () => cart?.items?.reduce((sum, item) => sum + ((item.price || 0) + (item.customizationPrice || 0)) * (item.quantity || 1), 0) || 0,
    [cart]
  );

  const finalTotal = useMemo(
    () => Math.max(0, total - (appliedCoupon?.discountAmount || 0)),
    [total, appliedCoupon]
  );

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode) return;
    setApplyingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const res = await fetch('/api/retail/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          cartSubtotal: total,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setAppliedCoupon(json.data);
        setPromoSuccess(`Coupon "${json.data.code}" applied! Saved ₹${json.data.discountAmount}.`);
      } else {
        setPromoError(json.error || 'Failed to apply coupon.');
      }
    } catch (err) {
      setPromoError('Connection error. Please try again.');
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoCode('');
    setPromoSuccess('');
    setPromoError('');
  };

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
          totalAmount: finalTotal,
          shippingAddress,
          couponCode: appliedCoupon?.code || null,
          discountAmount: appliedCoupon?.discountAmount || 0,
        }),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || responseData.message || 'Failed to place order');

      const { data: order, razorpayOrder, razorpayKeyId } = responseData;

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please refresh the page and try again.');
      }

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Iveara',
        description: `Payment for Order #${order._id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: shippingAddress.name || '',
          contact: shippingAddress.phone || '',
        },
        theme: {
          color: '#281000',
        },
        handler: async function (response) {
          try {
            setPlacingOrder(true);
            setError('');
            setSuccess('Verifying payment, please wait...');

            const verifyRes = await fetch('/api/retail/payment/verify', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            setSuccess('Payment successful! Redirecting...');
            router.push('/retail/account?tab=orders');
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setError(verifyErr.message || 'Payment verification failed. Please contact support.');
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
            setError('Payment process was cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to place order.');
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
                    <p className="mb-4">Please add an address in your account before placing an order.</p>
                    <a
                      href="/retail/account?tab=addresses"
                      className="inline-flex items-center justify-center px-6 h-12 bg-[#281000] text-white text-sm font-semibold rounded-full hover:opacity-90 transition"
                    >
                      + Add Shipping Address
                    </a>
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
                        {item.isCustomized && (
                          <div className="text-[11px] text-[#281000] font-bold mt-1">✨ Customized (Fee: ₹{item.customizationPrice})</div>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-4">
                          <div className="text-sm text-[#0E0E0E]/80">Qty: {item.quantity}</div>
                          <div className="text-lg font-semibold text-[#281000]">
                            ₹{(item.price + (item.customizationPrice || 0)) * (item.quantity || 1)}
                          </div>
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

              {/* Coupons Section */}
              <div className="border-b border-[#E8DED8] pb-6 mb-6">
                <h3 className="text-sm font-semibold text-[#281000] mb-3">Apply Promo Code</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                    <div>
                      <p className="text-xs text-green-800 font-bold font-mono">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-green-700 font-medium">₹{appliedCoupon.discountAmount} discount applied</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-red-500 hover:text-red-700 font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. FESTIVE20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 px-4 h-11 border border-[#E8DED8] rounded-full text-sm font-mono font-bold focus:border-[#281000] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={applyingPromo || !promoCode}
                        className="px-5 h-11 rounded-full bg-[#281000] hover:bg-[#1a0a00] text-white text-xs font-semibold uppercase tracking-wider transition disabled:opacity-50"
                      >
                        {applyingPromo ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    {promoError && <p className="text-xs font-medium text-red-600 px-1">{promoError}</p>}
                    {promoSuccess && <p className="text-xs font-medium text-green-600 px-1">{promoSuccess}</p>}
                  </form>
                )}
              </div>

              <div className="space-y-3 text-sm text-[#0E0E0E]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-[#281000] border-t border-[#E8DED8] pt-4 text-base">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
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
                Payment is processed securely via Razorpay. Do not close this page or press back while transaction is in progress.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
