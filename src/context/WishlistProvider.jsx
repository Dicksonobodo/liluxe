import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WishlistContext } from './WishlistContext';
import { useAuth } from '../hooks/useAuth';

const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Load wishlist from localStorage with lazy initialization
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('liluxe_wishlist');
    if (savedWishlist) {
      try {
        return JSON.parse(savedWishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        localStorage.removeItem('liluxe_wishlist');
        return [];
      }
    }
    return [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('liluxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (wishlist.includes(productId)) return;

    const updatedWishlist = [...wishlist, productId];
    setWishlist(updatedWishlist);

    // Sync to Firestore if user is logged in
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          wishlist: arrayUnion(productId)
        });
      } catch (error) {
        console.error('Error syncing wishlist:', error);
      }
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const updatedWishlist = wishlist.filter(id => id !== productId);
    setWishlist(updatedWishlist);

    // Sync to Firestore if user is logged in
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          wishlist: arrayRemove(productId)
        });
      } catch (error) {
        console.error('Error syncing wishlist:', error);
      }
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;