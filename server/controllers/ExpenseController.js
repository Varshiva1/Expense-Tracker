import Expense from '../models/Expense.js';

class ExpenseController {
  // Get all expenses
  static async getAllExpenses(req, res) {
    try {
      const { startDate, endDate, category } = req.query;
      const filters = { startDate, endDate, category };

      const expenses = await Expense.findAll(req.user.userId, filters);
      res.json(expenses);
    } catch (error) {
      console.error('Get expenses error:', error);
      res.status(500).json({ error: 'Server error fetching expenses' });
    }
  }

  // Get expense statistics
  static async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const filters = { startDate, endDate };

      const stats = await Expense.getStatistics(req.user.userId, filters);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Server error fetching statistics' });
    }
  }

  // Get single expense
  static async getExpense(req, res) {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id, req.user.userId);

      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      res.json(expense);
    } catch (error) {
      console.error('Get expense error:', error);
      res.status(500).json({ error: 'Server error fetching expense' });
    }
  }

  // Create expense
  static async createExpense(req, res) {
    try {
      const { amount, description, category, date } = req.body;

      const expense = await Expense.create(
        req.user.userId,
        amount,
        description,
        category,
        date
      );

      res.status(201).json(expense);
    } catch (error) {
      console.error('Create expense error:', error);
      res.status(500).json({ error: 'Server error creating expense' });
    }
  }

  // Update expense
  static async updateExpense(req, res) {
    try {
      const { id } = req.params;
      const { amount, description, category, date } = req.body;

      // Check if expense exists
      const expenseExists = await Expense.exists(id, req.user.userId);
      if (!expenseExists) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      // Build updates object
      const updates = {};
      if (amount !== undefined) updates.amount = amount;
      if (description !== undefined) updates.description = description;
      if (category !== undefined) updates.category = category;
      if (date !== undefined) updates.date = date;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const updatedExpense = await Expense.update(id, req.user.userId, updates);

      if (!updatedExpense) {
        return res.status(500).json({ error: 'Failed to update expense' });
      }

      res.json(updatedExpense);
    } catch (error) {
      console.error('Update expense error:', error);
      res.status(500).json({ error: 'Server error updating expense' });
    }
  }

  // Delete expense
  static async deleteExpense(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Expense.delete(id, req.user.userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Expense not found' });
      }

      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Delete expense error:', error);
      res.status(500).json({ error: 'Server error deleting expense' });
    }
  }
}

export default ExpenseController;

