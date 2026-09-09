import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../services/api.js';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft,
  Tag
} from 'lucide-react';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    line1: user?.addresses?.[0]?.line1 || '',
    line2: user?.addresses?.[0]?.line2 || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    phone: user?.addresses?.[0]?.phone || ''
  });

  const [useCustomAddress, setUseCustomAddress] = useState(user?.addresses?.length === 0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  const shippingPrice = subtotal >= 50 ? 0 : 5.99;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalPrice = Math.max(0, subtotal + shippingPrice - discountAmount);

  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
    setUseCustomAddress(false);
    const addr = user.addresses[index];
    if (addr) {
      setShippingAddress({
        line1: addr.line1,
        line2: addr.line2 || '',
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        phone: addr.phone
      });
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage('');

    try {
      const res = await API.post('/coupons/validate', {
        code: couponCodeInput.trim(),
        orderTotal: subtotal
      });

      if (res.data.valid) {
        setAppliedCoupon(res.data);
        setCouponMessage(`${res.data.code} applied! Saved $${res.data.discountAmount}`);
      }
      setCouponLoading(false);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponMessage(err.response?.data?.message || 'Invalid coupon code');
      setCouponLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
      setErrorMessage('Please provide a complete shipping address including line 1, city, pincode, and phone.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'Razorpay') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setErrorMessage('Failed to load Razorpay SDK. Please check your internet connection.');
          setLoading(false);
          return;
        }

        const paymentOrderRes = await API.post('/payment/create-order', { amount: totalPrice });
        const { orderId, key } = paymentOrderRes.data;

        const options = {
          key,
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
          name: 'NK ENTERPRISES',
          description: 'Baby Care Purchase',
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await API.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.verified) {
                const createOrderRes = await API.post('/orders', {
                  items: cartItems,
                  shippingAddress,
                  paymentMethod: 'Razorpay',
                  paymentResult: {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    status: 'paid'
                  },
                  itemsPrice: subtotal,
                  shippingPrice,
                  totalPrice
                });

                clearCart();
                setLoading(false);
                navigate('/order-confirmation', { state: { order: createOrderRes.data } });
              } else {
                setErrorMessage('Payment verification failed.');
                setLoading(false);
              }
            } catch (err) {
              console.error('[Order Placement Error]:', err);
              setErrorMessage('Failed to record order after payment.');
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setErrorMessage('Payment process was cancelled.');
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: shippingAddress.phone
          },
          theme: { color: '#2D6A75' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const createOrderRes = await API.post('/orders', {
          items: cartItems,
          shippingAddress,
          paymentMethod: 'COD',
          itemsPrice: subtotal,
          shippingPrice,
          totalPrice
        });

        clearCart();
        setLoading(false);
        navigate('/order-confirmation', { state: { order: createOrderRes.data } });
      }
    } catch (err) {
      console.error('[Checkout Submission Error]:', err);
      setErrorMessage(err.response?.data?.message || 'Checkout failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900">Secure Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Complete your purchase for NK Enterprises baby care</p>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="text-slate-500 hover:text-[#2D6A75] text-xs font-semibold flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Return to Cart
        </button>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-3xl text-sm font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-rose-700 transition-colors whitespace-nowrap"
          >
            Retry Checkout
          </button>
        </div>
      )}

      <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Addresses */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#2D6A75]" />
              <span>Select Shipping Address</span>
            </h3>

            {user?.addresses && user.addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectAddress(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressIndex === idx && !useCustomAddress ? 'border-[#2D6A75] bg-teal-50/50' : 'border-slate-100 bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-xs uppercase bg-white px-2 py-0.5 rounded border">
                        {addr.label}
                      </span>
                      {selectedAddressIndex === idx && !useCustomAddress && (
                        <CheckCircle2 size={16} className="text-[#2D6A75]" />
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 text-xs pt-1">{addr.line1}</p>
                    <p className="text-slate-500 text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-slate-500 text-xs">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setUseCustomAddress(!useCustomAddress)}
                className="text-xs font-bold text-[#2D6A75] flex items-center gap-1 hover:underline mb-3"
              >
                <Plus size={14} /> {useCustomAddress ? 'Use Saved Address' : 'Deliver to Different Address'}
              </button>

              {(useCustomAddress || !user?.addresses || user.addresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D6A75]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-[#2D6A75]" />
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-[#2D6A75] bg-teal-50/40' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="accent-[#2D6A75] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Razorpay Secure Online Payment</span>
                    <span className="text-xs text-slate-500">Credit/Debit Cards, UPI, NetBanking</span>
                  </div>
                </div>
                <ShieldCheck size={20} className="text-teal-600" />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#2D6A75] bg-teal-50/40' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#2D6A75] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-slate-500">Pay cash upon delivery</span>
                  </div>
                </div>
                <CheckCircle2 size={20} className="text-slate-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 h-fit space-y-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Review</h3>

          {/* Coupon Code Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
              <Tag size={13} className="text-[#2D6A75]" /> Promo / Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. BABY20"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase flex-1 focus:outline-none focus:border-[#2D6A75]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="bg-[#2D6A75] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1F4D55] transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-emerald-700' : 'text-rose-600'}`}>
                {couponMessage}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900">{shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
            <span>Total Payable</span>
            <span className="text-[#2D6A75] text-xl">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D6A75] hover:bg-[#1F4D55] text-white py-4 rounded-full font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>Pay Now — ${totalPrice.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
