import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, login as loginApi, register as registerApi, logout as logoutApi } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getProfile();
        setUser(userData); // Will be null if not authenticated
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userData = await loginApi(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const registeredUser = await registerApi(userData);
      setUser(registeredUser);
      return registeredUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const isRestaurantOwner = () => user?.role === 'restaurant';
  const isCorporate = () => user?.role === 'corporate';
  const isCloudKitchen = () => user?.role === 'cloudKitchen';
  const isCustomer = () => user?.role === 'customer';

  const getHomeRouteForRole = (role) => {
    switch (role) {
      case 'restaurant':
        return '/restaurant-dashboard';
      case 'corporate':
        return '/csr-dashboard';
      case 'cloudKitchen':
        return '/kitchen-dashboard';
      case 'customer':
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      authChecked,
      isAuthenticated: !!user,
      hasPermission,
      isRestaurantOwner,
      isCorporate,
      isCloudKitchen,
      isCustomer,
      getHomeRouteForRole,
    }}>
      {authChecked && children}
    </AuthContext.Provider>
  );
}; 