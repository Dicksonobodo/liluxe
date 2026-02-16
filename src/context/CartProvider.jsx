import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

const CartProvider = ({ children }) => {
  // Load cart from localStorage with lazy initialization
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('liluxe_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('liluxe_cart');
        return [];
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('liluxe_cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, selectedSize, quantity = 1, selectedColor = '') => {
    setCart(prevCart => {
      // Check if item with same product, size, and color already exists
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && 
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '/placeholder.png',
            category: product.category,
            selectedSize,
            selectedColor,
            quantity,
            maxStock: product.sizes?.find(s => s.size === selectedSize)?.stock || 0
          }
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedSize, selectedColor = '') => {
    setCart(prevCart =>
      prevCart.filter(item => !(
        item.id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      ))
    );
  };

  // Update item quantity
  const updateQuantity = (productId, selectedSize, newQuantity, selectedColor = '') => {
    if (newQuantity < 1) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity: Math.min(newQuantity, item.maxStock) }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;