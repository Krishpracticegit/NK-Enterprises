import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#2D6A75] text-white font-bold flex items-center justify-center">
                NK
              </div>
              <span className="font-extrabold text-xl text-slate-900 font-heading">NK ENTERPRISES</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Your trusted destination for organic baby clothing, ergonomic nursery furniture, and pediatrician-tested skincare.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck size={16} />
              <span>100% Certified Safe & Organic</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-[#2D6A75] transition-colors">Shop All Products</Link></li>
              <li><Link to="/products?category=baby-walkers" className="hover:text-[#2D6A75] transition-colors">Baby Walkers</Link></li>
              <li><Link to="/products?category=baby-bottles" className="hover:text-[#2D6A75] transition-colors">Baby Bottles</Link></li>
              <li><span className="text-slate-400 cursor-not-allowed">Apparel & Gear <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold ml-1">Available Soon</span></span></li>
              <li><Link to="/store-info" className="text-[#2D6A75] font-bold hover:underline flex items-center gap-1 mt-1">Visit Our Store</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Account */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/orders" className="hover:text-[#2D6A75] transition-colors">Track Orders</Link></li>
              <li><Link to="/profile" className="hover:text-[#2D6A75] transition-colors">My Profile & Addresses</Link></li>
              <li><Link to="/cart" className="hover:text-[#2D6A75] transition-colors">Shopping Cart</Link></li>
              <li><Link to="/store-info" className="hover:text-[#2D6A75] transition-colors">Store Directions & Hours</Link></li>
            </ul>
          </div>

          {/* Column 4: Visit Our Store */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">Visit Our Store</h4>
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-2 text-xs text-amber-950">
              <p className="font-bold flex items-center gap-1.5 text-slate-900">
                <MapPin size={14} className="text-[#2D6A75]" /> NK ENTERPRISES Flagship Store
              </p>
              <p className="text-slate-600 pl-5 font-semibold">5/2 street-09 Geeta colony , Delhi-110031</p>
              <p className="flex items-center gap-1.5 text-slate-600 pl-5 pt-1">
                <Clock size={13} /> Mon - Sat: 10:00 AM - 8:30 PM
              </p>
              <p className="flex items-center gap-1.5 text-slate-600 pl-5">
                <Phone size={13} /> +91 98765 43210
              </p>
              <Link 
                to="/store-info"
                className="mt-2 block text-center bg-[#2D6A75] text-white py-2 rounded-xl font-bold hover:bg-[#1F4D55] transition-colors"
              >
                Store Details & Map
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 NK ENTERPRISES. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
