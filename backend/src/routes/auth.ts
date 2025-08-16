import express from 'express';
import {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
  resendOTP
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);

// Protected routes
router.post('/logout', authenticate, logout);

export default router;