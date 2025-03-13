import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get orders with filters
export const getOrders = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get recent orders
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/orders/recent`, { params: { limit } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order statistics
export const getOrderStats = async (timeframe = 'today') => {
  try {
    const response = await axios.get(`${API_URL}/orders/stats`, { params: { timeframe } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get platform performance
export const getPlatformPerformance = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/platform-performance`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 