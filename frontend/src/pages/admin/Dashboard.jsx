import React, { useEffect, useState } from 'react';
import API from '../../services/api.js';
import { ShoppingBag, DollarSign, Package, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading stats dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-xs mt-0.5">Real-time metrics for NK Enterprises baby store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <DollarSign size={24} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Total Revenue</p>
          <h3 className="text-2xl font-extrabold text-slate-900">${stats.totalRevenue?.toFixed(2) || '0.00'}</h3>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="p-3 bg-teal-50 text-[#2D6A75] rounded-2xl w-fit">
            <ShoppingBag size={24} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Total Orders</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalOrders || 0}</h3>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit">
            <Package size={24} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Total Products</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalProducts || 0}</h3>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
            <AlertTriangle size={24} />
          </div>
          <p className="text-xs font-bold uppercase text-slate-400">Low Stock (&le;5)</p>
          <h3 className="text-2xl font-extrabold text-slate-900">{stats.lowStockProducts || 0}</h3>
        </div>
      </div>
    </div>
  );
}
