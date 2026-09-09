import React from 'react';
import { ShieldCheck, Package, ShoppingBag, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">Manage products, categories, orders, and store analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-teal-50 text-[#2D6A75] rounded-2xl w-fit">
            <Package size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Product Catalog</h3>
          <p className="text-xs text-slate-500">Add, edit, upload Cloudinary images, and set stock for baby products.</p>
          <Link to="/products" className="text-xs font-bold text-[#2D6A75] flex items-center gap-1 hover:underline pt-2">
            Manage Products <ChevronRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl w-fit">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Customer Orders</h3>
          <p className="text-xs text-slate-500">View placed orders, verify payments, and update shipping/delivery statuses.</p>
          <Link to="/orders" className="text-xs font-bold text-[#2D6A75] flex items-center gap-1 hover:underline pt-2">
            View All Orders <ChevronRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl w-fit">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Categories</h3>
          <p className="text-xs text-slate-500">Organize store categories (Nursery, Clothing, Feeding, Strollers).</p>
          <Link to="/products" className="text-xs font-bold text-[#2D6A75] flex items-center gap-1 hover:underline pt-2">
            Manage Categories <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
