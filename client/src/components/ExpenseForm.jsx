import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseForm = () => {
  const {
    createExpense,
    updateExpense,
    editingExpense,
    setEditingExpense,
  } = useExpenses();

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');

  // 🔥 load data into form when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        description: editingExpense.description,
        category: editingExpense.category,
        date: editingExpense.date.split('T')[0],
      });
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const expense = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
    };

    let result;
    if (editingExpense) {
      result = await updateExpense(editingExpense.id, expense);
    } else {
      result = await createExpense(expense);
    }

    if (!result.success) {
      setError(result.error);
      return;
    }

    setFormData({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });

    setEditingExpense(null);
  };

  return (
    <section className="card">
      <h2 className="text-2xl font-bold text-primary-600 mb-6">
        {editingExpense ? 'Update Expense' : 'Add New Expense'}
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group md:col-span-2">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary w-full md:w-auto">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>

          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => setEditingExpense(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;
