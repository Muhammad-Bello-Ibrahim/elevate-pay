import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// GET /users/me - Get logged-in user profile
router.get('/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: (req as any).user
  });
});

// PUT /users/me - Update profile
router.put('/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully'
  });
});

export default router;