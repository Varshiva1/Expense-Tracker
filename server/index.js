import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

import { init } from './config/database.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 🔑 Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api', (req, res) => res.send('Expense Backend API'));

// ❤️ Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 🧪 Root message (optional)
app.get('/', (req, res) => {
  res.json({
    message: 'Expense Tracker Backend API',
    status: 'Server is running',
    api: '/api/*',
    health: '/api/health'
  });
});

// 🚀 START SERVER (Render + Local compatible)
init()
  .then(() => {
    const PORT = process.env.PORT || 10000; // Render provides PORT automatically
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
