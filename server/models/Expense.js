import { pool } from '../config/database.js';

class Expense {
  // Get all expenses for a user with optional filters
  static async findAll(userId, filters = {}) {
    let query = 'SELECT * FROM expenses WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Find expense by ID and user ID
  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  }

  // Check if expense exists and belongs to user
  static async exists(id, userId) {
    const result = await pool.query(
      'SELECT id FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows.length > 0;
  }

  // Create new expense
  static async create(userId, amount, description, category, date) {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, amount, description, category, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, amount, description, category, date]
    );
    return result.rows[0];
  }

  // Update expense
  static async update(id, userId, updates) {
    const { amount, description, category, date } = updates;
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (amount !== undefined) {
      updateFields.push(`amount = $${paramIndex++}`);
      values.push(amount);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (date !== undefined) {
      updateFields.push(`date = $${paramIndex++}`);
      values.push(date);
    }

    if (updateFields.length === 0) {
      return null;
    }

    values.push(id, userId);

    const result = await pool.query(
      `UPDATE expenses SET ${updateFields.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Delete expense
  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows.length > 0;
  }

  // Get statistics
  static async getStatistics(userId, filters = {}) {
    let dateFilter = '';
    const params = [userId];
    let paramIndex = 2;

    if (filters.startDate && filters.endDate) {
      dateFilter = ` AND date >= $${paramIndex} AND date <= $${paramIndex + 1}`;
      params.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    // Total expenses
    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = $1${dateFilter}`,
      params
    );

    // Expenses by category
    const categoryResult = await pool.query(
      `SELECT category, COALESCE(SUM(amount), 0) as total 
       FROM expenses 
       WHERE user_id = $1${dateFilter}
       GROUP BY category 
       ORDER BY total DESC`,
      params
    );

    // Monthly expenses
    const monthlyResult = await pool.query(
      `SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(amount), 0) as total
       FROM expenses 
       WHERE user_id = $1${dateFilter}
       GROUP BY TO_CHAR(date, 'YYYY-MM')
       ORDER BY month DESC
       LIMIT 12`,
      params
    );

    return {
      total: parseFloat(totalResult.rows[0].total),
      byCategory: categoryResult.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.total),
      })),
      monthly: monthlyResult.rows.map(row => ({
        month: row.month,
        total: parseFloat(row.total),
      })),
    };
  }
}

export default Expense;

