import { createContext, useContext, useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [], monthly: [] });
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await expenseAPI.getAll(filters);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await expenseAPI.getStats(filters);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const createExpense = async (expenseData) => {
    try {
      const response = await expenseAPI.create(expenseData);
      await loadExpenses();
      await loadStats();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create expense',
      };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await expenseAPI.update(id, expenseData);
      await loadExpenses();
      await loadStats();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update expense',
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseAPI.delete(id);
      await loadExpenses();
      await loadStats();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete expense',
      };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadExpenses();
      loadStats();
    }
  }, [isAuthenticated, filters]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        stats,
        filters,
        loading,
        setFilters,
        createExpense,
        updateExpense,
        deleteExpense,
        loadExpenses,
        loadStats,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
