import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { 
  ShoppingBag, 
  Search, 
  User, 
  LogOut, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  ChevronDown,
  MapPin,
  X,
  Heart,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Debounced search (~400ms) - only trigger if query differs from active URL search param
  useEffect(() => {
    const activeSearch = searchParams.get('search') || '';
    if (searchQuery.trim() === activeSearch.trim()) return;

    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      } else if (searchParams.has('search') && searchQuery === '') {
        navigate('/products');
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, navigate]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100/70 shadow-xs">
      {/* Top Banner */}
      <div className="bg-[#2D6A75] text-white text-xs md:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles size={15} className="text-amber-300 animate-pulse" />
        <span>Welcome to <strong>NK ENTERPRISES</strong> — Premium & Certified Safe Baby Care</span>
        <span className="hidden sm:inline opacity-75">| Free Standard Shipping on Orders ₹999+</span>
        <Link to="/store-info" className="ml-2 underline text-amber-200 hover:text-white text-xs flex items-center gap-1">
          <MapPin size={13} /> Visit Our Store
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2D6A75] to-[#4F9DA6] flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              NK
            </div>
            <div>
              <span className="text-2xl font-extrabold font-heading tracking-tight text-slate-900 group-hover:text-[#2D6A75] transition-colors">
                NK ENTERPRISES
              </span>
              <p className="text-[10px] text-teal-700 font-bold uppercase tracking-widest -mt-1">Baby Care & Essentials</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search strollers, organic clothes, feeding gear..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-11 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A75]/30 focus:border-[#2D6A75] transition-all"
            />
            <button type="submit" className="absolute left-3.5 top-3 text-slate-400 hover:text-[#2D6A75]">
              <Search size={18} />
            </button>
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/store-info"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <MapPin size={14} className="text-amber-700" />
              <span>Store Info</span>
            </Link>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full text-slate-600 hover:text-amber-500 hover:bg-slate-100 transition-all active:scale-95"
              aria-label="Toggle Theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-full text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700 font-medium text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-[#2D6A75] font-bold flex items-center justify-center text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-slate-800">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div 
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2D6A75]"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#2D6A75]"
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50"
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-[#2D6A75] px-3 py-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex text-xs font-bold text-[#2D6A75] bg-teal-50 border border-teal-200 hover:bg-teal-100 px-4 py-2 rounded-full transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full ml-0.5 font-bold">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <nav className="border-t border-slate-100 bg-amber-50/40 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-8 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
          <Link to="/" className="hover:text-[#2D6A75] transition-colors">Home</Link>
          <Link to="/products" className="hover:text-[#2D6A75] transition-colors">All Baby Products</Link>
          <Link to="/products?category=baby-furniture" className="hover:text-[#2D6A75] transition-colors">Nursery & Furniture</Link>
          <Link to="/products?category=baby-clothing" className="hover:text-[#2D6A75] transition-colors">Organic Apparel</Link>
          <Link to="/products?category=feeding-nursing" className="hover:text-[#2D6A75] transition-colors">Feeding & Gear</Link>
          <Link to="/products?category=strollers-travel" className="hover:text-[#2D6A75] transition-colors">Strollers & Travel</Link>
          <Link to="/products?category=bath-skincare" className="hover:text-[#2D6A75] transition-colors">Bath & Skincare</Link>
          <Link to="/store-info" className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1">
            <MapPin size={13} /> Visit Our Store
          </Link>
        </div>
      </nav>
    </header>
  );
}
