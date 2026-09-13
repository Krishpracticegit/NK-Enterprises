import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getOptimizedImageUrl } from '../utils/imageUtils.js';
import { 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ArrowLeft, 
  Heart,
  MessageSquare,
  Send,
  AlertCircle
} from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchReviews = (prodId) => {
    API.get(`/products/${prodId}/reviews`)
      .then((res) => setReviews(res.data || []))
      .catch((err) => console.error('Failed to fetch reviews:', err));
  };

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${slug}`)
      .then((res) => {
        const prodData = res.data;
        setProduct(prodData);
        setLoading(false);
        fetchReviews(prodData._id);

        if (prodData.category?._id || prodData.category) {
          const catId = prodData.category?._id || prodData.category;
          API.get(`/products?category=${catId}&limit=4`)
            .then((relRes) => {
              const filtered = (relRes.data.products || []).filter((p) => p._id !== prodData._id);
              setRelatedProducts(filtered);
            })
            .catch((err) => console.error('Failed to fetch related products', err));
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail', err);
        setLoading(false);
      });
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('Please sign in to submit a review.');
      return;
    }

    if (!newComment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);

    try {
      await API.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        comment: newComment
      });

      setReviewSuccess('Thank you! Your review has been published.');
      setNewComment('');
      setNewRating(5);
      setSubmittingReview(false);

      // Refresh reviews & product data for updated rating
      fetchReviews(product._id);
      API.get(`/products/${slug}`).then((res) => setProduct(res.data));
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center text-slate-400">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/products" className="text-[#2D6A75] hover:underline mt-2 inline-block">
          Back to all products
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{`${product.name} | NK Enterprises Baby Care`}</title>
        <meta 
          name="description" 
          content={product.description ? product.description.slice(0, 155) : `Buy ${product.name} at NK Enterprises. Safety certified & organic.`} 
        />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
            <img 
              src={getOptimizedImageUrl(product.images?.[activeImage], 800, product.name, product.category?.name)} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            {product.ageGroup && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#2D6A75] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Age: {product.ageGroup}
              </span>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-[#2D6A75] scale-105 shadow-md' : 'border-slate-200 opacity-70'}`}
                >
                  <img src={getOptimizedImageUrl(img, 160)} alt="" className="w-full h-full object-cover" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
              {product.category?.name || 'Organic Baby Care'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-3">
              {product.name}
            </h1>
            {reviews.length > 0 || product.numReviews > 0 ? (
              <div className="flex items-center gap-2 mt-3 text-amber-500 text-sm font-semibold">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span>{Number(product.ratingsAverage || 0).toFixed(1)}</span>
                <span className="text-slate-400 font-normal">
                  ({reviews.length > 0 ? reviews.length : product.numReviews} {reviews.length === 1 || product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">Brand: <strong>{product.brand || 'NK Enterprises'}</strong></span>
              </div>
            ) : (
              <div className="mt-3 text-sm text-slate-500 font-medium">
                Brand: <strong>{product.brand || 'NK Enterprises'}</strong>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-3 border-y border-slate-100 py-4">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{finalPrice?.toLocaleString('en-IN') || finalPrice}
            </span>
            {originalPrice && (
              <span className="text-lg text-slate-400 line-through">₹{originalPrice?.toLocaleString('en-IN') || originalPrice}</span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full ml-auto">
              In Stock ({product.stock} available)
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-700 uppercase">Quantity:</label>
              <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-[#2D6A75] hover:bg-[#1F4D55] active:scale-98 text-white py-4 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-[#2D6A75]/25 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart — ₹{(finalPrice * quantity).toLocaleString('en-IN')}</span>
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className={`p-4 rounded-full border border-slate-200 transition-colors ${isLiked ? 'bg-rose-500 text-white' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
              >
                <Heart size={20} className={isLiked ? 'fill-white' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specs & Reviews */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 border-b-2 transition-colors ${activeTab === 'description' ? 'border-[#2D6A75] text-[#2D6A75]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-[#2D6A75] text-[#2D6A75]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="prose text-slate-600 text-sm leading-relaxed space-y-3">
            <p>{product.description}</p>
            <h4 className="font-bold text-slate-900 pt-2">Product Specifications:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Brand:</strong> {product.brand || 'NK Enterprises'}</li>
              <li><strong>Age Group:</strong> {product.ageGroup || '0-6 Months'}</li>
              <li><strong>Safety Standard:</strong> 100% Certified Organic & Non-Toxic</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Review Submission Form (Protected) */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Write a Customer Review</h4>
              
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                  {reviewError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl font-semibold">
                      {reviewError}
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 rounded-xl font-semibold">
                      {reviewSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Your Rating:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className={`p-1 text-lg transition-transform ${star <= newRating ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Your Review Comment:</label>
                    <textarea
                      rows="3"
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share details about quality, soft fabric, sizing..."
                      className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#2D6A75]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-[#2D6A75] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs hover:bg-[#1F4D55] transition-colors flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-500">
                  Please <Link to={`/login?redirect=/products/${slug}`} className="text-[#2D6A75] font-bold underline">sign in</Link> to write a review.
                </p>
              )}
            </div>

            {/* List of Reviews */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet for this product. Be the first to leave a review!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="border border-slate-100 p-4 rounded-2xl space-y-2 text-xs bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{rev.user?.name || 'Verified Buyer'}</span>
                      <span className="text-amber-400 font-bold text-sm">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold font-heading text-slate-900">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
