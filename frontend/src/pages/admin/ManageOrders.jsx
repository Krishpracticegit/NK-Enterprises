import React, { useEffect, useState } from 'react';
import API from '../../services/api.js';
import { RefreshCw, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const query = statusFilter ? `?orderStatus=${statusFilter}` : '';
    API.get(`/orders${query}`)
      .then((res) => {
        setOrders(res.data.orders || res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
      setUpdatingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">Manage Orders</h2>
          <p className="text-slate-500 text-xs mt-0.5">Track customer orders and update delivery statuses</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D6A75] shadow-xs"
          >
            <option value="">All Order Statuses</option>
            <option value="placed">Placed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading orders list...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status Update</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{order.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#2D6A75]">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>

                        <select
                          disabled={updatingId === order._id}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-[11px] font-semibold text-slate-800 focus:outline-none"
                        >
                          <option value="placed">Placed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="p-2 rounded-xl text-slate-500 hover:text-[#2D6A75] hover:bg-slate-100 inline-block"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
