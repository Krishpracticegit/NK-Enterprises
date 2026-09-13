import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import ProductCard from '../components/product/ProductCard.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { WishlistProvider } from '../context/WishlistContext.jsx';

const mockProduct = {
  _id: 'prod123',
  name: 'Organic Cotton Baby Onesie',
  slug: 'organic-cotton-baby-onesie',
  price: 1499,
  discountPrice: 0,
  images: ['/images/onesie.jpg'],
  ageGroup: '0-6m',
  category: { name: 'Organic Apparel' },
  ratingsAverage: 0,
  numReviews: 0
};

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          {ui}
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  test('renders product name and price correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Organic Cotton Baby Onesie')).toBeInTheDocument();
    expect(screen.getByText(/1,499/)).toBeInTheDocument();
  });
});
