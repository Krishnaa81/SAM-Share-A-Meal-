import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get revenue statistics
export const getRevenueStats = async (timeframe = 'monthly') => {
  try {
    const response = await axios.get(`${API_URL}/stats/revenue`, { params: { timeframe } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get customer ratings
export const getCustomerRatings = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/ratings`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get dashboard statistics
export const getDashboardStats = async (role) => {
  try {
    const response = await axios.get(`${API_URL}/stats/dashboard`, { params: { role } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get performance metrics
export const getPerformanceMetrics = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/stats/performance`, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 