import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { orderAPI } from '../api/api';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Error loading cart:', err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch user's orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await orderAPI.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, size = '', gender = '', color = '') => {
    const existingItem = cartItems.find(item => item._id === product._id && item.selectedSize === size && item.selectedGender === gender && item.selectedColor === color);

    if (existingItem) {
      // Increase quantity if same product with same size/gender/color in cart
      setCartItems(cartItems.map(item =>
        item._id === product._id && item.selectedSize === size && item.selectedGender === gender && item.selectedColor === color
          ? { ...item, qty: (item.qty || 1) + quantity }
          : item
      ));
    } else {
      // Add new item to cart with size, gender, and color
      setCartItems([...cartItems, { ...product, qty: quantity, selectedSize: size, selectedGender: gender, selectedColor: color }]);
    }
  }, [cartItems]);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item._id === productId
        ? { ...item, qty: quantity }
        : item
    ).filter(item => (item.qty || 1) > 0));
  }, [cartItems]);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  }, [cartItems]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Get cart totals
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.qty || 1), 0);
  }, [cartItems]);

  // Create order from cart items
  const createOrder = useCallback(async (shippingAddress, paymentMethod) => {
    try {
      setError(null);
      setLoading(true);

      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          qty: item.qty || 1,
          price: item.price,
          image: item.image,
        })),
        shippingAddress,
        paymentMethod,
        taxPrice: getTotalPrice() * 0.1, // 10% tax
        shippingPrice: 10, // Flat shipping fee
        totalPrice: getTotalPrice() * 1.1 + 10, // Total with tax + shipping
      };

      const response = await orderAPI.createOrder(orderData);

      // Clear cart after successful order
      clearCart();

      // Refresh orders list
      await fetchOrders();

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartItems, getTotalPrice, clearCart, fetchOrders]);

  // Mark order as paid
  const markOrderAsPaid = useCallback(async (orderId) => {
    try {
      setError(null);
      setLoading(true);
      await orderAPI.markAsPaid(orderId);
      await fetchOrders(); // Refresh orders
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const value = {
    // State
    cartItems,
    orders,
    loading,
    error,
    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    createOrder,
    markOrderAsPaid,
    fetchOrders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
