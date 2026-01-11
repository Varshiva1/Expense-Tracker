import { createContext, useContext, useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [], monthly: [] });
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [loading, setLoading] = useState(false);

  // 🔥 shared edit state
  const [editingExpense, setEditingExpense] = useState(null);

  const loadExpenses = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await expenseAPI.getAll(filters);
      setExpenses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await expenseAPI.getStats(filters);
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const createExpense = async (data) => {
    try {
      const res = await expenseAPI.create(data);
      await loadExpenses();
      await loadStats();
      return { success: true, data: res.data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const updateExpense = async (id, data) => {
    try {
      const res = await expenseAPI.update(id, data);
      await loadExpenses();
      await loadStats();
      setEditingExpense(null); // 🔥 reset edit mode
      return { success: true, data: res.data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseAPI.delete(id);
      await loadExpenses();
      await loadStats();
    } catch (e) {
      console.error(e);
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

        // 🔥 expose edit state
        editingExpense,
        setEditingExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
