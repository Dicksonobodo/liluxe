import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ cartCount = 0, wishlistCount = 0, user = null, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 bg-white border-b border-stone-200 z-30">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
  <img 
    src="/logo.png" 
    alt="LILUXE" 
    className="h-8 md:h-10 w-auto"
  />
  {/* Optional: Keep text alongside logo */}
  <span className="font-serif text-xl md:text-2xl font-semibold">
    LILUXE STORE
  </span>
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm uppercase tracking-wider hover:text-stone-600 transition-colors">
              Shop
            </Link>
            <Link to="/shop?category=clothes" className="text-sm uppercase tracking-wider hover:text-stone-600 transition-colors">
              Clothes
            </Link>
            <Link to="/shop?category=bags" className="text-sm uppercase tracking-wider hover:text-stone-600 transition-colors">
              Bags
            </Link>
            <Link to="/shop?category=shoes" className="text-sm uppercase tracking-wider hover:text-stone-600 transition-colors">
              Shoes
            </Link>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search */}
            <button className="text-stone-600 hover:text-stone-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Profile/Sign In Icon */}
{user ? (
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="p-2 hover:bg-stone-100 rounded-full"
    title={user.name || 'Account'}
  >
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </button>
) : (
  <Link to="/auth" className="p-2 hover:bg-stone-100 rounded-full" title="Sign In">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </Link>
)}

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-stone-600 hover:text-stone-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-stone-600 hover:text-stone-900 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="text-stone-600 hover:text-stone-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-stone-50">
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-stone-50">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="text-sm uppercase tracking-wider hover:text-stone-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-stone-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 py-4 space-y-4 animate-in slide-in-from-top duration-200">
            <Link
              to="/shop"
              className="block text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              to="/shop?category=clothes"
              className="block text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clothes
            </Link>
            <Link
              to="/shop?category=bags"
              className="block text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bags
            </Link>
            <Link
              to="/shop?category=shoes"
              className="block text-sm uppercase tracking-wider"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shoes
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block text-sm uppercase tracking-wider"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block text-sm uppercase tracking-wider"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block text-sm uppercase tracking-wider"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;