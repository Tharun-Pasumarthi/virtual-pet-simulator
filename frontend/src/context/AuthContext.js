import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0); // 🪙 Add coins state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const fetchedUser = response.data.data.user;
      setUser(fetchedUser);
      setCoins(fetchedUser.coins || 0); // 🪙 Set coins from backend
      setError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setCoins(0); // 🪙 Reset coins on failure
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setCoins(user.coins || 0); // 🪙 Set coins on login
      setError(null);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setCoins(user.coins || 0); // 🪙 Set coins on register
      setError(null);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCoins(0); // 🪙 Reset coins on logout
    setError(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  // 🪙 Add function to update coins globally
  const updateCoins = (amount) => {
    setCoins(amount);
  };

  const value = {
    user,
    coins,         // 🪙 exposed coins
    updateCoins,   // 🪙 exposed updateCoins
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser: checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
