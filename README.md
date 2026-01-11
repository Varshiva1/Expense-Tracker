# Expense Tracker

A full-stack expense tracking application built with Node.js, Express, PostgreSQL, JWT authentication, React, and Chart.js for data visualization.

## Features

- 🔐 User authentication (Register/Login) with JWT
- 💰 Add, edit, and delete expenses
- 📊 Visual statistics with Chart.js (Category breakdown, Monthly trends)
- 🔍 Filter expenses by date range and category
- 📱 Responsive design with Tailwind CSS
- ⚛️ Modern React frontend with Context API

## Tech Stack

- **Backend**: Node.js + Express (MVC Architecture)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Visualization**: Chart.js + React Chart.js 2
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Structure

```
Expense-Tracker/
├── server/                      # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js         # Database connection and initialization
│   ├── controllers/
│   │   ├── AuthController.js   # Authentication business logic
│   │   └── ExpenseController.js # Expense business logic
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User data model
│   │   └── Expense.js          # Expense data model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── expenses.js         # Expense routes
│   └── index.js                # Express server entry point
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles (Tailwind)
│   │   ├── router/
│   │   │   └── AppRouter.jsx   # Application router
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── ExpensesList.jsx
│   │   ├── context/            # React Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── ExpenseContext.jsx
│   │   └── services/           # API services
│   │       └── api.js
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind CSS configuration
├── package.json                # Root package.json (server dependencies)
├── vercel.json                 # Vercel deployment configuration
└── README.md
```

The backend follows the **MVC (Model-View-Controller)** pattern:
- **Models**: Handle all database operations (`server/models/`)
- **Controllers**: Contain business logic and handle requests/responses (`server/controllers/`)
- **Routes**: Define endpoints and validation, delegate to controllers (`server/routes/`)
- **Config**: Database configuration and initialization (`server/config/`)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense-Tracker
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```
   
   Or use the npm script:
   ```bash
   npm run client:install
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE expense_tracker;
   ```

5. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=expense_tracker
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   ```

6. **Start the development servers**

   **Terminal 1 - Backend Server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

   **Terminal 2 - Frontend Development Server:**
   ```bash
   npm run client
   ```
   Or:
   ```bash
   cd client && npm run dev
   ```
   Frontend will run on `http://localhost:3001` (Vite default port)

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:3001`

## Production Build

1. **Build the client**
   ```bash
   npm run client:build
   ```
   Or:
   ```bash
   cd client && npm run build
   ```
   This creates a `client/build` directory with optimized production files.

2. **Start the production server**
   ```bash
   npm start:prod
   ```
   
   The server will serve the built React app from `client/build` on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```

### Expenses (Requires Authentication - JWT Token)
- `GET /api/expenses` - Get all expenses (supports query params: `startDate`, `endDate`, `category`)
- `GET /api/expenses/stats` - Get expense statistics (supports query params: `startDate`, `endDate`)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
  ```json
  {
    "amount": 50.00,
    "description": "Grocery shopping",
    "category": "Food",
    "date": "2024-01-15"
  }
  ```
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

All expense endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR(50), UNIQUE)
- `email` (VARCHAR(100), UNIQUE)
- `password` (VARCHAR(255) - hashed with bcrypt)
- `created_at` (TIMESTAMP)

### Expenses Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY references users(id))
- `amount` (DECIMAL(10, 2))
- `description` (VARCHAR(255))
- `category` (VARCHAR(50))
- `date` (DATE)
- `created_at` (TIMESTAMP)

Indexes:
- `idx_expenses_user_id` on `user_id`
- `idx_expenses_date` on `date`

## Usage

1. **Register/Login**: Click the Register or Login button to create an account or sign in
2. **Add Expense**: Fill out the form with amount, description, category, and date
3. **View Statistics**: See total expenses and monthly breakdown
4. **Charts**: Visualize expenses by category (Doughnut chart) and monthly trends (Bar chart)
5. **Filter**: Use the filter section to view expenses by date range or category
6. **Edit/Delete**: Click the Edit or Delete buttons on any expense item

## Scripts

### Root Level
- `npm start` - Start both backend and frontend development servers together
- `npm start:prod` - Start production server (after building frontend)
- `npm start:server` - Start production server only
- `npm run dev` - Start backend development server only (with nodemon)
- `npm run client` - Start frontend development server only (Vite)
- `npm run client:build` - Build frontend for production
- `npm run client:install` - Install client dependencies

### Client Level
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Vercel Deployment (Backend Only)

This project is configured to deploy **only the backend API** on Vercel.

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Vercel will automatically build and deploy the backend API using `vercel.json`

**Root Directory**: `.` (project root)

**Backend Environment Variables** (set in Vercel dashboard):
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `PORT` (optional, defaults to 5000)
- `NODE_ENV` (set to `production`)

**API Endpoints** will be available at:
- `https://your-backend.vercel.app/api/*`
- Example: `https://your-backend.vercel.app/api/health`

**Frontend Deployment**:

1. Deploy the frontend separately (Vercel, Netlify, etc.)
2. **Set Environment Variable** in your frontend deployment:
   - Variable Name: `VITE_API_BASE`
   - Variable Value: `https://your-backend.vercel.app/api`
   - Example: If your backend URL is `https://expense-api.vercel.app`, set `VITE_API_BASE=https://expense-api.vercel.app/api`

**Important**: The frontend uses `VITE_API_BASE` environment variable. You only need to change this **one variable** when deploying to update the API URL!

See `VERCEL_DEPLOYMENT_SETUP.md` for detailed deployment instructions.

## Security Notes

- Passwords are hashed using bcryptjs (10 rounds)
- JWT tokens are used for authentication (expires based on configuration)
- All expense operations are user-scoped (users can only access their own expenses)
- CORS is configured to allow requests from frontend
- Change the `JWT_SECRET` in production to a strong, random string
- Never commit `.env` files to version control

## License

ISC
