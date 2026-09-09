import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Store, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Store Info', path: '/store-info', icon: Store }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl mb-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading">NK ENTERPRISES Admin Panel</h1>
            <p className="text-xs text-slate-400">Management & Store Control System</p>
          </div>
        </div>
        <Link to="/" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
          Store Front <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-100 h-fit space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
            Admin Navigation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${isActive ? 'bg-[#2D6A75] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Admin Area */}
        <main className="lg:col-span-4 space-y-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
