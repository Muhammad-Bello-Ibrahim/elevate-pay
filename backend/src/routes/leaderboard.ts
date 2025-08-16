import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All leaderboard routes require authentication
router.use(authenticate);

// GET /leaderboard - Get top earners
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Leaderboard retrieved successfully',
    data: {
      topEarners: [],
      userRank: null
    }
  });
});

// GET /leaderboard/badges - Get user badges
router.get('/badges', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Badges retrieved successfully',
    data: {
      badges: [],
      availableBadges: []
    }
  });
});

export default router;