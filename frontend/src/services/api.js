import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const productService = {
  getProducts: async ({ page = 0, size = 12, sortBy = 'newest' } = {}) => {
    const response = await api.get('/products', {
      params: { page, size, sortBy },
    });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getFeatured: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },
  searchProducts: async (params) => {
    const response = await api.get('/products/search', { params });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },
  updateQuantity: async (productId, quantity) => {
    const response = await api.put(`/cart/update/${productId}?quantity=${quantity}`);
    return response.data;
  },
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },
  checkout: async (shippingAddress) => {
    const response = await api.post('/cart/checkout', { shippingAddress });
    return response.data;
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/add/${productId}`);
    return response.data;
  },
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },
};

export default api;
