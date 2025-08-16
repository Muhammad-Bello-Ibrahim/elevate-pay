import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All wallet routes require authentication
router.use(authenticate);

// POST /wallet/fund - Fund wallet
router.post('/fund', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wallet funding initiated'
  });
});

// POST /wallet/activate - Pay activation fee
router.post('/activate', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Account activated successfully'
  });
});

// POST /wallet/withdraw - Withdraw funds
router.post('/withdraw', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Withdrawal request submitted'
  });
});

// GET /wallet/transactions - Transaction history
router.get('/transactions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Transaction history retrieved',
    data: []
  });
});

// GET /wallet/balance - Balance information
router.get('/balance', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Balance retrieved successfully',
    data: {
      available_balance: 0,
      pending_withdrawals: 0,
      total_earned: 0
    }
  });
});

export default router;