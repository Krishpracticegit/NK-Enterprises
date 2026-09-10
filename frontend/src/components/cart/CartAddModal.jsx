import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageUtils.js';

export default function CartAddModal({ item, itemCount, subtotal, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 w-full max-w-sm bg-white rounded-3xl border border-teal-100 shadow-2xl p-5 transform-gpu transition-all ease-out duration-200 animate-in fade-in slide-in-from-right-8">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 size={18} />
          <span>Added to Shopping Cart!</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close popup"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 py-4">
        <img
          src={getOptimizedImageUrl(item.image, 160)}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-2xl border border-slate-100 flex-shrink-0"
          loading="eager"
          decoding="async"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} • ${item.price}</p>
          <p className="text-xs font-extrabold text-[#2D6A75] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 flex items-center justify-between text-xs mb-4">
        <span className="text-slate-600 font-semibold">Cart Total ({itemCount} items):</span>
        <span className="font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-full font-bold text-xs transition-colors"
        >
          Continue
        </button>
        <button
          onClick={() => {
            onClose();
            navigate('/cart');
          }}
          className="w-full bg-[#2D6A75] hover:bg-[#1F4D55] text-white py-2.5 rounded-full font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Move to Cart</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

