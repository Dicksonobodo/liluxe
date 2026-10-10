import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { badgePop } from '../ui/motion';

const NavItem = ({ to, icon, label, count, isActive }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center gap-1 relative isolate transition-colors active:scale-95 ${
      isActive ? 'text-stone-900' : 'text-stone-400'
    }`}
  >
    {/* Active indicator - slides between tabs */}
    {isActive && (
      <motion.span
        layoutId="bottom-nav-active"
        className="absolute -inset-x-1 -inset-y-1.5 bg-stone-100 rounded-xl -z-10"
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />
    )}

    {/* Notification Badge */}
    {count > 0 && (
      <motion.span key={count} {...badgePop} className="absolute -top-1 left-1/2 -translate-x-1/2 translate-x-2 bg-stone-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </motion.span>
    )}
    
    {/* Icon */}
    <span className="text-2xl">{icon}</span>
    
    {/* Label */}
    <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
  </Link>
);

const BottomNav = ({ cartCount = 0, wishlistCount = 0 }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-lg px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            <NavItem 
              to="/" 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              label="Home"
              isActive={isActive("/")}
            />
            
            <NavItem 
              to="/shop" 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              label="Shop"
              isActive={isActive("/shop")}
            />
            
            <NavItem 
              to="/wishlist" 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              label="Saved"
              count={wishlistCount}
              isActive={isActive("/wishlist")}
            />
            
            <NavItem 
              to="/cart" 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              label="Cart"
              count={cartCount}
              isActive={isActive("/cart")}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;