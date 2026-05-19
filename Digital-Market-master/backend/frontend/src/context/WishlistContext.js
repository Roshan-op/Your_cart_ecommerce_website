import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create Wishlist Context
const WishlistContext = createContext();

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Initialize wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (err) {
        console.error('Error loading wishlist:', err);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = useCallback((product) => {
    const existingItem = wishlistItems.find(item => item._id === product._id);

    if (!existingItem) {
      // Add new item to wishlist
      setWishlistItems([...wishlistItems, { ...product }]);
    }
  }, [wishlistItems]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(wishlistItems.filter(item => item._id !== productId));
  }, [wishlistItems]);

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback((product) => {
    const existingItem = wishlistItems.find(item => item._id === product._id);

    if (existingItem) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const value = {
    // State
    wishlistItems,
    // Methods
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount: () => wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use Wishlist Context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export default WishlistContext;
