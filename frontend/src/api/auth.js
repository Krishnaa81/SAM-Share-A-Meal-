import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register user
export const register = async (userData) => {
  try {
    console.log('Sending registration data to API:', userData);
    
    const response = await axios.post(`${API_URL}/register`, userData);
    
    console.log('Registration API response:', response.data);
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error.response?.data || error.message);
    
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw error.response.data?.message || 'Server responded with an error';
    } else if (error.request) {
      // The request was made but no response was received
      throw 'No response from server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request
      throw error.message || 'An error occurred during registration';
    }
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
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
export const logout = () => {
  localStorage.removeItem('user');
};

// Get user profile
export const getProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/profile`, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || 'Failed to fetch profile';
    } else {
      throw error.message || 'An error occurred while fetching profile';
    }
  }
};

// Update user profile
export const updateProfile = async (userData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/profile`, userData, config);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
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
  return JSON.parse(localStorage.getItem('user'));
}; 