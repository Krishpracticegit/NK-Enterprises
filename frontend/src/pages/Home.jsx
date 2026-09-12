import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  Heart
} from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    API.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to fetch categories:', err));

    // Fetch all products to group into sections
    API.get('/products?limit=100')
      .then((res) => {
        setAllProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  // Category Sections Definition
  const sectionDefs = [
    { title: 'Nursery & Furniture', slug: 'baby-furniture', desc: 'Solid pinewood cribs, cots & nursery glider chairs', icon: '🪑' },
    { title: 'Organic Apparel', slug: 'baby-clothing', desc: 'GOTS-certified rompers, muslin swaddles & gift sets', icon: '👗' },
    { title: 'Feeding & Gear', slug: 'feeding-nursing', desc: 'Anti-colic glass bottles, sterilisers & weaning sets', icon: '🍼' },
    { title: 'Strollers & Travel', slug: 'strollers-travel', desc: 'UltraFold strollers, 3-in-1 travel systems & car seats', icon: '🛒' },
    { title: 'Bath & Skincare', slug: 'bath-skincare', desc: 'Tear-free shampoo, cradle cap oil, body lotion & bath sets', icon: '🛁' }
  ];

  // Helper to get products for a section
  const getProductsForSlug = (slug) => {
    return allProducts.filter((p) => p.category?.slug === slug || p.categorySlug === slug);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col justify-between">
      <Helmet>
        <title>NK Enterprises - Premium & Certified Safe Baby Care</title>
        <meta 
          name="description" 
          content="Discover 100% organic apparel, safety-certified nursery furniture, dermatologist-tested baby skincare, and BPA-free feeding gear at NK Enterprises." 
        />
      </Helmet>

      {/* Main Content */}
      <main className="flex-1 space-y-14 pb-16">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#F6F0E6] via-[#FAF6EE] to-[#EBF5F7] p-8 lg:p-14 border border-amber-100/80 shadow-sm grid md:grid-cols-2 items-center gap-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#2D6A75]/10 text-[#2D6A75] uppercase tracking-wider">
                <Sparkles size={14} /> Certified Organic & Non-Toxic
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 leading-tight">
                Gentle Care for Your Baby's World.
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
                At <strong>NK ENTERPRISES</strong>, we craft & curate 100% organic clothing, ergonomic cribs, and pediatrician-tested baby skincare.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/products"
                  className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-[#2D6A75]/25 hover:shadow-xl transition-all flex items-center gap-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/store-info"
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-full font-semibold transition-all"
                >
                  Visit Our Store
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-300">
                <img 
                  src="/images/hero.jpg" 
                  alt="NK Enterprises Baby Nursery" 
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Safety Standard</p>
                  <p className="text-sm font-bold text-slate-900">100% Pediatrician Approved</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Badges */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-50 text-[#2D6A75]">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Free Shipping ₹999+</h4>
                <p className="text-xs text-slate-500">Fast delivery across India</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">100% Certified Organic</h4>
                <p className="text-xs text-slate-500">Hypoallergenic & safe</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Easy 30-Day Returns</h4>
                <p className="text-xs text-slate-500">Hassle-free guarantee</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">NK Enterprises Trust</h4>
                <p className="text-xs text-slate-500">Over 50k happy parents</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Shop by Category</h2>
              <p className="text-slate-500 text-sm mt-1">Explore certified safe products for every stage of your baby's growth</p>
            </div>
            <Link to="/products" className="text-[#2D6A75] font-semibold text-sm flex items-center gap-1 hover:underline">
              View All Catalog <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {sectionDefs.map((sec, idx) => (
              <Link 
                key={sec.slug} 
                to={`/products?category=${sec.slug}`}
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between h-40 group"
              >
                <div className="text-3xl mb-1">{sec.icon}</div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2D6A75] transition-colors">{sec.title}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">{sec.desc}</p>
                </div>
                <div className="self-end text-xs font-bold text-[#2D6A75] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span> <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Individual Category Sections Showcase */}
        {sectionDefs.map((sec) => {
          const secProducts = getProductsForSlug(sec.slug);
          return (
            <section key={sec.slug} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6 border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sec.icon}</span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">{sec.title}</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{sec.desc}</p>
                  </div>
                </div>
                <Link 
                  to={`/products?category=${sec.slug}`}
                  className="text-[#2D6A75] font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100"
                >
                  View All {sec.title} <ChevronRight size={15} />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100"></div>
                  ))}
                </div>
              ) : secProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {secProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl text-center text-slate-400 text-sm">
                  Loading section items...
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
