/**
 * API Service for connecting to Django Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = 'http://localhost:8000/api';

// Get JWT token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Handle API errors
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If 401 Unauthorized, clear auth and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.detail || data.message || 'API Error');
  }
  
  return data;
};

// =============== PRODUCT API ===============

export const productAPI = {
  // Get all products with optional filters
  getProducts: async (keyword = '', page = 1) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (page) params.append('page', page);
    
    const response = await fetch(`${API_BASE_URL}/products/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Get all products (no pagination)
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/?all=true`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Get top rated products
  getTopProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/top/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Get single product
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Create product review
  createReview: async (productId, rating, comment) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(response);
  },

  // Get recommended products
  getRecommendations: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/recommend/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};

// =============== USER API ===============

export const userAPI = {
  // Register new user
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(response);
    
    // Save token and user info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  },

  // Login user
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(response);
    
    // Save token and user info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (name, email, password = '') => {
    const response = await fetch(`${API_BASE_URL}/users/profile/update/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(response);
    
    // Update stored user info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// =============== ORDER API ===============

export const orderAPI = {
  // Create order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/add/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/myorders/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Mark order as paid
  markAsPaid: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },

  // Mark order as delivered (admin only)
  markAsDelivered: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/deliver/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    return handleResponse(response);
  },
};

// =============== UTILITY FUNCTIONS ===============

export const apiUtils = {
  // Format price with currency
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Get image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  },
};

export default {
  productAPI,
  userAPI,
  orderAPI,
  apiUtils,
};
