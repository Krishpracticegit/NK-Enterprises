import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CartAddModal from '../components/cart/CartAddModal.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('nk_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [recentAddedItem, setRecentAddedItem] = useState(null);

  const handleCloseModal = useCallback(() => {
    setRecentAddedItem(null);
  }, []);

  useEffect(() => {
    localStorage.setItem('nk_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const itemImage = product.images?.[0] || '/images/hero.jpg';

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product._id === product._id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity,
            name: product.name,
            price: unitPrice,
            image: itemImage
          }
        ];
      }
    });

    // Set popup state for direct "Move to Cart" notification
    setRecentAddedItem({
      id: Date.now(),
      name: product.name,
      price: unitPrice,
      quantity,
      image: itemImage
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  const updateQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        subtotal,
        itemCount
      }}
    >
      {children}

      {/* Direct Move to Cart Pop-Up Notification */}
      {recentAddedItem && (
        <CartAddModal
          key={recentAddedItem.id}
          item={recentAddedItem}
          itemCount={itemCount}
          subtotal={subtotal}
          onClose={handleCloseModal}
        />
      )}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
