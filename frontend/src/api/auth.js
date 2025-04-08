import axios from 'axios';
import { config } from '../config/env';

const API_URL = `${config.API_URL}/auth`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is important for cookies to be sent
});

// Store token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Add token to request headers if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 errors
      setToken(null);
      
      // Don't redirect if we're already on the login page to prevent infinite loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data.user || response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || 'Registration failed';
    } else if (error.request) {
      throw 'No response from server. Please try again later.';
    } else {
      throw error.message || 'An error occurred during registration';
    }
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data.user || response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || 'Invalid credentials';
    } else if (error.request) {
      throw 'No response from server. Please try again later.';
    } else {
      throw error.message || 'An error occurred during login';
    }
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/logout');
    setToken(null);
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear token even if server logout fails
    setToken(null);
    throw error;
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    // Don't throw the error, just return null to prevent reload loops
    return null;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/profile', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || 'Failed to update profile';
    } else {
      throw error.message || 'An error occurred while updating profile';
    }
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};