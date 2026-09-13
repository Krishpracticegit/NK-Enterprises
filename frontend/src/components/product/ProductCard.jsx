import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product._id);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  const rawImage = product.images?.[0] || '/images/hero.jpg';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
        <img
          src={getOptimizedImageUrl(rawImage, 400, product.name, product.category?.name)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.ageGroup && (
            <span className="bg-white/90 backdrop-blur-md text-[#2D6A75] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.ageGroup}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button 
          onClick={() => toggleWishlist(product)}
          aria-label="Add to Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md transition-colors ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500'}`}
        >
          <Heart size={15} className={isLiked ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-0.5">
            {product.category?.name || 'Organic Baby Care'}
          </span>
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-[#2D6A75] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
          {product.numReviews > 0 ? (
            <div className="flex items-center gap-1 mt-1.5 text-amber-500 text-xs font-semibold">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{Number(product.ratingsAverage || 0).toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.numReviews})</span>
            </div>
          ) : (
            <div className="h-5 mt-1.5"></div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              ₹{finalPrice?.toLocaleString('en-IN') || finalPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-1.5">₹{originalPrice?.toLocaleString('en-IN') || originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            aria-label="Add to Cart"
            className="bg-[#2D6A75] hover:bg-[#1F4D55] active:scale-95 text-white p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 font-semibold text-xs"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
