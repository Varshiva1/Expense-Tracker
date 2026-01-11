import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import api from '../services/api';   // 🔥 ADD THIS

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  // 🔥 FIXED: now uses axios instance with correct backend URL
  const verifyToken = async () => {
    try {
      const response = await api.get('/expenses');
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed',
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.errors?.[0]?.msg ||
          error.message ||
          'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
