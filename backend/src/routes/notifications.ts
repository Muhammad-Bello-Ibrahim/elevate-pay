import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// POST /notifications/push - Send push notification
router.post('/push', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Push notification sent successfully'
  });
});

// GET /notifications - Get user notifications
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: []
  });
});

// PUT /notifications/:id/read - Mark notification as read
router.put('/:id/read', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

export default router;