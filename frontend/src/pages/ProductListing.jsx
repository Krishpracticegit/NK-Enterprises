import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import { 
  Filter, 
  Search, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  PackageX 
} from 'lucide-react';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL query params
  const currentCategory = searchParams.get('category') || '';
  const currentAgeGroup = searchParams.get('ageGroup') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Price range state
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  const categoryTitleMap = {
    'baby-walkers': 'Baby Walkers',
    'walkers': 'Baby Walkers',
    'baby-bottles': 'Baby Bottles',
    'bottles': 'Baby Bottles',
    'baby-furniture': 'Nursery & Furniture (Available Soon)',
    'baby-clothing': 'Organic Apparel (Available Soon)',
    'feeding-nursing': 'Feeding & Gear (Available Soon)',
    'strollers-travel': 'Strollers & Travel (Available Soon)',
    'bath-skincare': 'Bath & Skincare (Available Soon)'
  };

  const activeCategoryTitle = currentCategory
    ? (categoryTitleMap[currentCategory.toLowerCase()] ||
       categories.find(c => c.slug === currentCategory)?.name ||
       currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : '';

  const pageTitle = currentCategory 
    ? `${activeCategoryTitle} - Baby Care | NK Enterprises`
    : currentSearch 
    ? `Search Results for "${currentSearch}" | NK Enterprises`
    : `All Baby Products - Nursery, Apparel & Care | NK Enterprises`;

  const pageDescription = currentCategory
    ? `Explore certified safe and organic ${activeCategoryTitle} essentials for your baby at NK Enterprises. Top quality & pediatrician approved.`
    : `Browse our complete collection of certified organic baby clothing, cribs, skincare, and feeding gear at NK Enterprises.`;

  useEffect(() => {
    // Fetch categories for sidebar filter
    API.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      ...(currentCategory && { category: currentCategory }),
      ...(currentAgeGroup && { ageGroup: currentAgeGroup }),
      ...(currentMinPrice && { minPrice: currentMinPrice }),
      ...(currentMaxPrice && { maxPrice: currentMaxPrice }),
      ...(currentSearch && { search: currentSearch }),
      ...(currentSort && { sort: currentSort }),
      page: currentPage,
      limit: 12
    }).toString();

    API.get(`/products?${query}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalResults(res.data.totalResults || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [currentCategory, currentAgeGroup, currentMinPrice, currentMaxPrice, currentSearch, currentSort, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');

    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      {/* Header & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900">
            {currentSearch ? `Search Results for "${currentSearch}"` : currentCategory ? activeCategoryTitle : 'All Baby Products'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Showing {totalResults} certified safe & organic products
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase text-slate-500 hidden sm:inline">Sort:</label>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2D6A75] shadow-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-100 h-fit shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 font-bold text-slate-900">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#2D6A75]" />
              <span>Filter Options</span>
            </div>
            {(currentCategory || currentAgeGroup || currentMinPrice || currentMaxPrice || currentSearch) && (
              <button 
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
            <select
              value={currentCategory}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2D6A75]"
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
              onChange={(e) => updateParam('ageGroup', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2D6A75]"
            >
              <option value="">All Age Groups</option>
              <option value="0-6m">0 - 6 Months</option>
              <option value="6-12m">6 - 12 Months</option>
              <option value="1-3y">1 - 3 Years</option>
              <option value="3y+">3+ Years</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Price Range (₹)</label>
            <form onSubmit={handlePriceApply} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2D6A75]"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2D6A75]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D6A75] hover:bg-[#1F4D55] text-white py-2 rounded-xl font-bold text-xs transition-colors shadow-xs"
              >
                Apply Price Filter
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-4/5 max-w-sm bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 font-bold text-slate-900">
                <span>Filter Products</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
                <select
                  value={currentCategory}
                  onChange={(e) => {
                    updateParam('category', e.target.value);
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Age Group</label>
                <select
                  value={currentAgeGroup}
                  onChange={(e) => {
                    updateParam('ageGroup', e.target.value);
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800"
                >
                  <option value="">All Age Groups</option>
                  <option value="0-6m">0 - 6 Months</option>
                  <option value="6-12m">6 - 12 Months</option>
                  <option value="1-3y">1 - 3 Years</option>
                  <option value="3y+">3+ Years</option>
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-rose-50 text-rose-600 font-bold py-2.5 rounded-xl text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white rounded-2xl h-80 border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Friendly Empty State */
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <PackageX size={32} />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">No Matching Baby Products Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                We couldn't find any products matching your selected criteria. Try adjusting your search term or clearing price filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#2D6A75] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md inline-flex items-center gap-2"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', currentPage - 1)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => updateParam('page', pageNum)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors ${pageNum === currentPage ? 'bg-[#2D6A75] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', currentPage + 1)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
