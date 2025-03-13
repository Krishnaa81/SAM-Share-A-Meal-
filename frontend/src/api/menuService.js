import axios from 'axios';

const API_URL = 'http://localhost:5000/api/menu-items';

// Get menu items with filters
export const getMenuItems = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get top selling items
export const getTopSellingItems = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/top-selling`, { params: { limit } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add menu item
export const addMenuItem = async (itemData) => {
  try {
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update menu item
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete menu item
export const deleteMenuItem = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 