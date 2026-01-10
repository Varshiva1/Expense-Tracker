import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import ExpenseController from '../controllers/ExpenseController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middleware
const validateCreateExpense = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

const validateUpdateExpense = [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
];

// Validation handler middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', ExpenseController.getAllExpenses);
router.get('/stats', ExpenseController.getStatistics);
router.get('/:id', ExpenseController.getExpense);
router.post('/', validateCreateExpense, handleValidation, ExpenseController.createExpense);
router.put('/:id', validateUpdateExpense, handleValidation, ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

export default router;

