import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-slate-500 text-sm">Save your favorite organic baby items by clicking the heart icon</p>
        <Link 
          to="/products"
          className="bg-[#2D6A75] text-white px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-md hover:bg-[#1F4D55] transition-colors"
        >
          <span>Explore Store</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900">My Wishlist</h1>
          <p className="text-slate-500 text-sm mt-1">{wishlistItems.length} saved baby items</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-colors"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
