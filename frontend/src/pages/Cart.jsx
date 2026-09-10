import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-[#2D6A75] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-slate-500 text-sm">Explore our organic baby products and add items to your cart</p>
        <Link 
          to="/products"
          className="bg-[#2D6A75] text-white px-6 py-3 rounded-full font-bold text-sm inline-flex items-center gap-2 shadow-md hover:bg-[#1F4D55] transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shippingEstimate = subtotal >= 50 ? 0 : 5.99;
  const grandTotal = subtotal + shippingEstimate;

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">Shopping Cart</h1>
        <Link to="/products" className="text-slate-500 hover:text-[#2D6A75] text-sm font-semibold inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.product._id} 
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  loading="lazy"
                />
                <div>
                  <Link to={`/products/${item.product.slug}`} className="font-bold text-slate-900 text-sm sm:text-base hover:text-[#2D6A75] transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-sm font-extrabold text-[#2D6A75] mt-1">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQty(item.product._id, item.quantity - 1)}
                    className="px-3 py-1 text-slate-700 font-bold hover:bg-slate-200"
                    aria-label="Decrease Quantity"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 text-slate-700 font-bold hover:bg-slate-200"
                    aria-label="Increase Quantity"
                  >
                    +
                  </button>
                </div>

                {/* Line Item Price */}
                <span className="font-extrabold text-slate-900 text-base sm:w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  aria-label="Remove item"
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 h-fit space-y-5 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

          <div className="space-y-2.5 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Estimate</span>
              <span className="font-bold text-slate-900">
                {shippingEstimate === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingEstimate.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 50 && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for Free Shipping!
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
            <span>Total Amount</span>
            <span className="text-[#2D6A75] text-xl">${grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-[#2D6A75] hover:bg-[#1F4D55] text-white py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
