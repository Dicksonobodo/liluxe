import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import { Button } from '../components/ui';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-16 text-center">
        <svg
          className="w-20 h-20 mx-auto text-stone-300 mb-6"
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
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
          Your cart is empty
        </h2>
        <p className="text-stone-600 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
            Shopping Cart
          </h1>
          <p className="text-stone-600">
            {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        
        <button
          onClick={clearCart}
          className="text-sm text-stone-600 hover:text-red-600 transition-colors hidden md:block"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <CartItem
              key={`${item.id}-${item.selectedSize}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          {/* Mobile Clear Cart */}
          <button
            onClick={clearCart}
            className="text-sm text-stone-600 hover:text-red-600 transition-colors md:hidden w-full text-center py-3"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-stone-200 p-6 space-y-4">
            <h3 className="text-xl font-serif font-semibold mb-4">
              Order Summary
            </h3>

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-medium">
                ₦{cartTotal.toLocaleString('en-NG')}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between">
              <span className="text-stone-600">Shipping</span>
              <span className="text-sm text-stone-500">
                Calculated at checkout
              </span>
            </div>

            <div className="border-t border-stone-200 pt-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  ₦{cartTotal.toLocaleString('en-NG')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Link to="/shop">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>

            {/* Info */}
            <div className="pt-4 space-y-3 text-sm text-stone-600">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free shipping on orders over ₦50,000
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;