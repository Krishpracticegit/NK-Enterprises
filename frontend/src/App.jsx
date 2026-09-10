import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import { RefreshCw } from 'lucide-react';

// Lazy-loaded Storefront & Auth Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const ProductListing = lazy(() => import('./pages/ProductListing.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const OrderHistory = lazy(() => import('./pages/OrderHistory.jsx'));
const OrderDetail = lazy(() => import('./pages/OrderDetail.jsx'));
const StoreInfo = lazy(() => import('./pages/StoreInfo.jsx'));

// Lazy-loaded Admin Control Panel Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts.jsx'));
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories.jsx'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders.jsx'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-[#2D6A75] gap-2 font-medium">
    <RefreshCw size={24} className="animate-spin" />
    <span>Loading...</span>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <CartProvider>
            <WishlistProvider>
              <div className="min-[#FAF8F5] min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col justify-between antialiased font-['Plus_Jakarta_Sans',sans-serif]">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Storefront Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<ProductListing />} />
                      <Route path="/products/:slug" element={<ProductDetail />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/store-info" element={<StoreInfo />} />

                      {/* Authentication Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Protected Account & Order Routes */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-confirmation"
                        element={
                          <ProtectedRoute>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrderHistory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <ProtectedRoute>
                            <OrderDetail />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Management Panel Routes */}
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <AdminLayout>
                              <Suspense fallback={<PageLoader />}>
                                <Routes>
                                  <Route path="" element={<Navigate to="dashboard" replace />} />
                                  <Route path="dashboard" element={<Dashboard />} />
                                  <Route path="products" element={<ManageProducts />} />
                                  <Route path="categories" element={<ManageCategories />} />
                                  <Route path="orders" element={<ManageOrders />} />
                                </Routes>
                              </Suspense>
                            </AdminLayout>
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
