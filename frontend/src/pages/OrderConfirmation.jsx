import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShoppingBag, MapPin, CreditCard } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderData = location.state?.order;

  if (!orderData) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-50">
        <CheckCircle2 size={48} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
          Thank You for Your Order!
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          We have received your order and are preparing your baby products with love and care at NK ENTERPRISES.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Order ID</span>
            <p className="font-extrabold text-slate-900 text-base">#{orderData._id?.slice(-8).toUpperCase() || 'SUCCESS'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {orderData.isPaid ? 'Paid via Razorpay' : 'Order Placed (COD)'}
            </span>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items ({orderData.items?.length || 0})</h4>
          {orderData.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <img src={item.image || '/images/hero.jpg'} alt="" className="w-12 h-12 object-cover rounded-xl border" />
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price}</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Delivery & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin size={14} className="text-[#2D6A75]" /> Shipping Address
            </span>
            <p className="font-bold text-slate-900">{orderData.shippingAddress?.line1}</p>
            <p className="text-slate-600">{orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}</p>
            <p className="text-slate-600">Phone: {orderData.shippingAddress?.phone}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase flex items-center gap-1">
              <CreditCard size={14} className="text-[#2D6A75]" /> Payment Details
            </span>
            <p className="font-bold text-slate-900">Method: {orderData.paymentMethod}</p>
            <p className="text-slate-600">Total Paid: <strong className="text-[#2D6A75] text-sm">${orderData.totalPrice?.toFixed(2)}</strong></p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link 
          to="/orders" 
          className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-all"
        >
          <Package size={18} />
          <span>View My Orders</span>
        </Link>
        <Link 
          to="/products" 
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
