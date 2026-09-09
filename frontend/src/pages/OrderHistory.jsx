import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Package, ChevronRight, RefreshCw, ShoppingBag } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading order history...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-[#2D6A75] rounded-full flex items-center justify-center mx-auto">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">No Orders Found</h2>
        <p className="text-slate-500 text-sm">You haven't placed any orders with NK Enterprises yet.</p>
        <Link 
          to="/products"
          className="bg-[#2D6A75] text-white px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-md hover:bg-[#1F4D55] transition-colors"
        >
          <ShoppingBag size={18} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">Order History</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage your past purchases</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 text-xs text-slate-500 gap-3">
              <div>
                <span className="font-bold text-slate-900 text-sm sm:text-base">Order #{order._id.slice(-8).toUpperCase()}</span>
                <p className="pt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                  {order.isPaid ? 'Paid' : 'COD'}
                </span>

                <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${getStatusBadgeStyle(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image || '/images/hero.jpg'} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Footer & Link */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
              <span className="text-lg font-extrabold text-slate-900">
                Total: <span className="text-[#2D6A75]">${order.totalPrice.toFixed(2)}</span>
              </span>

              <Link
                to={`/orders/${order._id}`}
                className="bg-teal-50 hover:bg-teal-100 text-[#2D6A75] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>View Order Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
