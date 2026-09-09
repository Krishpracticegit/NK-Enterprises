import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { Search, Filter, Star, ShoppingBag, Heart, RefreshCw } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const currentCategory = searchParams.get('category') || '';
  const currentAgeGroup = searchParams.get('ageGroup') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = searchParams.get('page') || 1;

  useEffect(() => {
    // Fetch categories
    API.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      ...(currentCategory && { category: currentCategory }),
      ...(currentAgeGroup && { ageGroup: currentAgeGroup }),
      ...(currentSearch && { search: currentSearch }),
      ...(currentSort && { sort: currentSort }),
      page: currentPage,
      limit: 12
    }).toString();

    API.get(`/products?${query}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [currentCategory, currentAgeGroup, currentSearch, currentSort, currentPage]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">Explore Baby Products</h1>
        <p className="text-slate-500 text-sm mt-1">Discover certified safe & organic products for your baby</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 h-fit">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-bold text-slate-900">
            <Filter size={18} className="text-[#2D6A75]" />
            <span>Filter Products</span>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Search</label>
            <input
              type="text"
              value={currentSearch}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A75]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
            <select
              value={currentCategory}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A75]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Age Group</label>
            <select
              value={currentAgeGroup}
              onChange={(e) => updateFilter('ageGroup', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A75]"
            >
              <option value="">All Age Groups</option>
              <option value="0-6m">0 - 6 Months</option>
              <option value="6-12m">6 - 12 Months</option>
              <option value="1-3y">1 - 3 Years</option>
              <option value="3y+">3+ Years</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sort By</label>
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A75]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
              <RefreshCw className="animate-spin" size={24} />
              <span>Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
              <h3 className="text-xl font-bold text-slate-800">No Products Found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search term</p>
              <button 
                onClick={() => setSearchParams({})}
                className="bg-[#2D6A75] text-white px-5 py-2 rounded-full font-semibold text-xs mt-2"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div 
                  key={prod._id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                    <img 
                      src={prod.images?.[0] || '/images/hero.jpg'} 
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#2D6A75] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {prod.ageGroup}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                        {prod.category?.name || 'Baby Care'}
                      </span>
                      <Link to={`/products/${prod.slug}`}>
                        <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-2 hover:text-[#2D6A75] transition-colors">
                          {prod.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs font-semibold">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span>{prod.ratingsAverage || 4.9}</span>
                        <span className="text-slate-400 font-normal">({prod.numReviews || 12})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">
                          ${prod.discountPrice > 0 ? prod.discountPrice : prod.price}
                        </span>
                        {prod.discountPrice > 0 && (
                          <span className="text-xs text-slate-400 line-through ml-2">${prod.price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white p-2.5 rounded-xl transition-colors shadow-xs"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
