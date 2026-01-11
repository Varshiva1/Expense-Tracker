import { pool } from '../config/database.js';

class User {
  // Find user by username or email
  static async findByUsernameOrEmail(usernameOrEmail) {
    const result = await pool.query(
      'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1',
      [usernameOrEmail]
    );
    return result.rows[0] || null;
  }

  // Find user by username
  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  // Check if user exists by username or email
  static async exists(username, email) {
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    return result.rows.length > 0;
  }

  // Create new user
  static async create(username, email, hashedPassword) {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}

export default User;

