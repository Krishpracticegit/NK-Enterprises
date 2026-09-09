import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Box, 
  XCircle 
} from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load order detail:', err);
        setErrorMessage(err.response?.data?.message || 'Failed to load order detail');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-slate-900">{errorMessage || 'Order Not Found'}</h2>
        <Link to="/orders" className="text-[#2D6A75] font-semibold underline inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Order History
        </Link>
      </div>
    );
  }

  // Timeline Progress calculation
  const stages = [
    { key: 'placed', label: 'Order Placed', icon: Clock },
    { key: 'packed', label: 'Packed & Prepared', icon: Box },
    { key: 'shipped', label: 'Shipped out', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const currentStatus = order.orderStatus?.toLowerCase();
  const getStageIndex = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'packed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return -1;
    }
  };

  const currentStageIdx = getStageIndex(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link to="/orders" className="text-slate-500 hover:text-[#2D6A75] text-xs font-semibold inline-flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
            {order.isPaid ? 'Paid via Razorpay' : 'Cash on Delivery'}
          </span>
        </div>
      </div>

      {/* Visual Status Timeline (placed -> packed -> shipped -> delivered) */}
      {currentStatus === 'cancelled' ? (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center space-y-2">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle size={28} />
          </div>
          <h3 className="font-bold text-rose-900 text-base">This Order Was Cancelled</h3>
          <p className="text-xs text-rose-700">If you have any questions regarding refund or cancellation, please contact our support team.</p>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Order Delivery Timeline</h3>

          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
            {/* Background Track Line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
            {/* Active Progress Line */}
            <div 
              className="absolute top-1/2 left-8 h-1 bg-[#2D6A75] -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStageIdx) / (stages.length - 1)) * 90}%` }}
            ></div>

            {stages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const Icon = stage.icon;

              return (
                <div key={stage.key} className="relative z-10 flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-xs ${isCompleted ? 'bg-[#2D6A75] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-bold mt-2 text-center max-w-[80px] ${isCurrent ? 'text-[#2D6A75]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.deliveredAt && (
            <p className="text-center text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-xl border border-emerald-100">
              ✓ Package Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Ordered Items Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Items in Order</h3>
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <img src={item.image || '/images/hero.jpg'} alt="" className="w-16 h-16 object-cover rounded-2xl border" />
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">Unit Price: ${item.price} • Quantity: {item.quantity}</p>
                </div>
              </div>
              <span className="font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2 mb-2">
            <MapPin size={16} className="text-[#2D6A75]" /> Shipping Address
          </h4>
          <p className="font-bold text-slate-800 text-sm">{order.shippingAddress?.line1}</p>
          {order.shippingAddress?.line2 && <p className="text-slate-600">{order.shippingAddress.line2}</p>}
          <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          <p className="text-slate-600">Phone: {order.shippingAddress?.phone}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2 mb-2">
            <CreditCard size={16} className="text-[#2D6A75]" /> Order Summary
          </h4>
          <div className="space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-slate-900">${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-bold text-slate-900">${order.shippingPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-sm font-extrabold text-slate-900">
              <span>Total Amount:</span>
              <span className="text-[#2D6A75]">${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
