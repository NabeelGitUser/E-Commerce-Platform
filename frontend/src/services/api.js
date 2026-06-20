// FILE: src/services/api.js
// ===========================================
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const adminLogin = (data) => api.post('/auth/admin/login', data);

// Product APIs
export const getAllProducts = () => api.get('/products');
export const searchProducts = (query) => api.get(`/products/search?query=${query}`);
export const getProductById = (id) => api.get(`/products/${id}`);

// Admin Product APIs
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// Cart APIs
export const addToCart = (data) => api.post('/cart', data);
export const getCartItems = () => api.get('/cart');
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}?quantity=${quantity}`);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart/clear');

// Order APIs
export const createOrder = (data) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders');
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`);
export const getAllOrders = () => api.get('/admin/orders');
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
