import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import { Button } from '../ui';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="ml-auto relative w-full md:w-[480px] bg-white h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-serif font-semibold">
            Shopping Cart ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-stone-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="font-serif text-2xl mb-2">Your cart is empty</h3>
              <p className="text-stone-600 mb-6">Add some products to get started</p>
              <Button onClick={onClose} variant="primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <CartItem
                  key={`${item.id}-${item.selectedSize}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">
                ₦{cartTotal.toLocaleString('en-NG')}
              </span>
            </div>

            <p className="text-sm text-stone-600">
              Shipping calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/checkout" onClick={onClose}>
                <Button variant="primary" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link to="/cart" onClick={onClose}>
                <Button variant="secondary" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CartDrawer;