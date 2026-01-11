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
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration (allow all origins)
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (must be before static file serving)
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get("/api", (req, res) => res.send("expense Backend API"));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root route - helpful message in development
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({
      message: 'Expense Tracker Backend API',
      status: 'Server is running',
      frontend: 'Please access the frontend at http://localhost:3000',
      api: 'API endpoints are available at /api/*',
      health: '/api/health'
    });
  });
}

// Serve static files from client directory (only in production)
// In development, Vite dev server handles the frontend
if (process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  app.use(express.static(join(__dirname, '../client/build')));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '../client/build/index.html'));
    }
  });
}

// Export for Vercel serverless functions
export default app;

// Initialize database and start HTTP server (only in local development)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.VERCEL_ENV) {
  init()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
} else {
  // For Vercel, initialize database on cold start
  init().catch((err) => {
    console.error('Failed to initialize database:', err);
  });
}
