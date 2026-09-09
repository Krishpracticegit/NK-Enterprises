import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { Package, Clock, CheckCircle2, Truck, RefreshCw } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load user orders', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading order history...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-teal-50 text-[#2D6A75] rounded-full flex items-center justify-center mx-auto">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">No Orders Found</h2>
        <p className="text-slate-500 text-sm">You haven't placed any orders with NK Enterprises yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold font-heading text-slate-900">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 text-xs text-slate-500 gap-2">
              <div>
                <span className="font-bold text-slate-900 text-sm">Order #{order._id.slice(-8).toUpperCase()}</span>
                <p className="pt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid (COD)'}
                </span>
                <span className="bg-teal-50 text-[#2D6A75] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-teal-200">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Item Rows */}
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                      <img src={item.image || '/images/hero.jpg'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
              <span className="text-slate-500 text-xs">Payment Method: <strong>{order.paymentMethod}</strong></span>
              <span className="text-lg font-extrabold text-slate-900">Total: <span className="text-[#2D6A75]">${order.totalPrice.toFixed(2)}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
