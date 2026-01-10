# Expense Tracker

A full-stack expense tracking application built with Node.js, Express, PostgreSQL, JWT authentication, and Chart.js for data visualization.

## Features

- 🔐 User authentication (Register/Login) with JWT
- 💰 Add, edit, and delete expenses
- 📊 Visual statistics with Chart.js (Category breakdown, Monthly trends)
- 🔍 Filter expenses by date range and category
- 📱 Responsive design

## Tech Stack

- **Backend**: Node.js + Express (MVC Architecture)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla JavaScript, HTML, Tailwind CSS
- **Visualization**: Chart.js

## Project Structure

```
Expense-Tracker/
├── server/                   # Backend code
│   ├── config/
│   │   └── database.js      # Database connection and initialization
│   ├── controllers/
│   │   ├── AuthController.js    # Authentication business logic
│   │   └── ExpenseController.js # Expense business logic
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # User data model
│   │   └── Expense.js       # Expense data model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── expenses.js      # Expense routes
│   └── index.js             # Express server entry point
├── client/                   # Frontend code
│   ├── index.html           # Frontend HTML
│   ├── input.css            # Tailwind CSS input file
│   ├── styles.css           # Compiled Tailwind CSS
│   └── app.js               # Frontend JavaScript
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json
└── README.md
```

The backend follows the **MVC (Model-View-Controller)** pattern:
- **Models**: Handle all database operations (`models/`)
- **Controllers**: Contain business logic and handle requests/responses (`controllers/`)
- **Routes**: Define endpoints and validation, delegate to controllers (`routes/`)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE expense_tracker;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=expense_tracker
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=3000
   ```

5. **Build Tailwind CSS** (if not already built)
   ```bash
   npm run build-css
   ```
   
   For development with CSS watching:
   ```bash
   npm run watch-css
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Expenses (Requires Authentication)
- `GET /api/expenses` - Get all expenses (supports query params: startDate, endDate, category)
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR - hashed)
- `created_at` (TIMESTAMP)

### Expenses Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `amount` (DECIMAL)
- `description` (VARCHAR)
- `category` (VARCHAR)
- `date` (DATE)
- `created_at` (TIMESTAMP)

## Usage

1. **Register/Login**: Click the Register or Login button to create an account or sign in
2. **Add Expense**: Fill out the form with amount, description, category, and date
3. **View Statistics**: See total expenses and monthly breakdown
4. **Charts**: Visualize expenses by category and monthly trends
5. **Filter**: Use the filter section to view expenses by date range or category
6. **Edit/Delete**: Click the Edit or Delete buttons on any expense item

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- All expense operations are user-scoped (users can only access their own expenses)
- Change the `JWT_SECRET` in production to a strong, random string

## License

ISC

