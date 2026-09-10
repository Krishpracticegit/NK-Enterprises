import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Navbar from '../components/layout/Navbar.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { WishlistProvider } from '../context/WishlistContext.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

const mockProduct = {
  _id: 'prod456',
  name: 'Ergonomic Baby Carrier',
  slug: 'ergonomic-baby-carrier',
  price: 89.99,
  discountPrice: 0,
  images: ['/images/carrier.jpg'],
  ageGroup: '3-12m',
  category: { name: 'Feeding & Gear' }
};

const renderNavbarWithProduct = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <ProductCard product={mockProduct} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navbar Cart Counter Integration', () => {
  test('adding a product to cart updates the Navbar cart count badge', async () => {
    const user = userEvent.setup();
    renderNavbarWithProduct();

    // Initial cart badge should display 0
    const cartButton = screen.getByRole('link', { name: /cart 0/i });
    expect(cartButton).toBeInTheDocument();

    // Click "Add to Cart" button on ProductCard
    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addToCartBtn);

    // Navbar cart badge should now display 1
    const updatedCartButton = screen.getByRole('link', { name: /cart 1/i });
    expect(updatedCartButton).toBeInTheDocument();
  });
});
