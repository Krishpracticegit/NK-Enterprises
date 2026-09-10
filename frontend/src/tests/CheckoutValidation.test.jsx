import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import Checkout from '../pages/Checkout.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

const mockCartItems = [
  {
    product: { _id: 'prod789', name: 'Baby Swaddle Wrap', price: 19.99 },
    quantity: 1,
    name: 'Baby Swaddle Wrap',
    price: 19.99,
    image: '/images/swaddle.jpg'
  }
];

describe('Checkout Form Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('nk_cart', JSON.stringify(mockCartItems));
  });

  test('shows a validation error on empty required shipping fields', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Checkout />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /pay now/i });
    const form = submitButton.closest('form');
    expect(form).toBeInTheDocument();

    // Fire submit event on form with empty shipping fields
    fireEvent.submit(form);

    // Validation error banner should be displayed
    const errorMessage = await screen.findByText(/Please provide a complete shipping address/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
