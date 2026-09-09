import React from 'react';
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

// Public & Customer Pages
import Home from './pages/Home.jsx';
import ProductListing from './pages/ProductListing.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import StoreInfo from './pages/StoreInfo.jsx';

// Admin Control Panel Pages
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
                <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col justify-between antialiased font-['Plus_Jakarta_Sans',sans-serif]">
                  <Navbar />
                  <main className="flex-1">
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
                              <Routes>
                                <Route path="" element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="products" element={<ManageProducts />} />
                                <Route path="categories" element={<ManageCategories />} />
                                <Route path="orders" element={<ManageOrders />} />
                              </Routes>
                            </AdminLayout>
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
    </ThemeProvider>
  );
}
