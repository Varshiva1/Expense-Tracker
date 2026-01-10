import express from 'express';
import { body, validationResult } from 'express-validator';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation handler middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register
router.post('/register', validateRegister, handleValidation, AuthController.register);

// Login
router.post('/login', validateLogin, handleValidation, AuthController.login);

export default router;

