import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nk_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('nk_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('nk_token', token);
    } else {
      localStorage.removeItem('nk_token');
    }
  }, [token]);

  // Sync user object with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nk_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nk_user');
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;
      setUser(userData);
      setToken(userToken);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed. Invalid credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', userData);
      const { token: userToken, ...newUser } = res.data;
      setUser(newUser);
      setToken(userToken);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nk_user');
    localStorage.removeItem('nk_token');
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await API.put('/auth/profile', profileData);
      const { token: userToken, ...updatedUser } = res.data;
      setUser(updatedUser);
      if (userToken) setToken(userToken);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Profile update failed.';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
