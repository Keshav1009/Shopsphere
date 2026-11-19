import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mnb_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mnb_token');
      if (storedToken) {
        try {
          const res = await api.getProfile();
          if (res?.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.success && res.token) {
      localStorage.setItem('mnb_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res?.success && res.token) {
      localStorage.setItem('mnb_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('mnb_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res?.success) {
      setUser(res.user);
      return res.user;
    }
    throw new Error(res?.message || 'Failed to update profile');
  };

  // Demo Quick-Login for easy BCA-311 viva evaluation
  const quickLogin = async (role = 'admin') => {
    if (role === 'admin') {
      return login('admin@mnbsolutions.com', 'Admin@123');
    } else if (role === 'customer') {
      return login('user@mnbsolutions.com', 'User@123');
    } else if (role === 'vendor') {
      return login('vendor.priya@mnbsolutions.com', 'Vendor@123');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
    login,
    register,
    logout,
    updateUser,
    quickLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
