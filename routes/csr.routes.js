const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  verifyPayment,
  generateTaxCertificate,
  downloadReceipt,
  downloadCertificate,
  getDashboardStats
} = require('../controllers/csr.controller');
const { auth, admin, corporate } = require('../middlewares/auth');
const fraudDetectionService = require('../services/fraudDetection.service');
const csrLeaderboardService = require('../services/csrLeaderboard.service');

// All routes require authentication
router.use(auth);

// Transaction routes
router.post('/transactions', corporate, createTransaction);
router.get('/transactions', corporate, getTransactions);
router.get('/transactions/:id', getTransactionById);
router.put('/transactions/:id/status', admin, updateTransactionStatus);
router.post('/transactions/:id/verify-payment', corporate, verifyPayment);

// Tax certificate routes
router.post('/tax-certificate', corporate, generateTaxCertificate);
router.get('/receipts/:receiptNumber', downloadReceipt);
router.get('/certificates/:certificateId', downloadCertificate);

// Dashboard
router.get('/dashboard', corporate, getDashboardStats);

// New routes for leaderboard and verification
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await csrLeaderboardService.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/corporate/verify/:gstNumber', admin, async (req, res) => {
  try {
    const { gstNumber } = req.params;
    const isEligible = await fraudDetectionService.verifyRevenueRequirement(gstNumber);
    res.json({ isEligible });
  } catch (error) {
    console.error('Corporate verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin route to manually update leaderboard
router.post('/leaderboard/update', admin, async (req, res) => {
  try {
    await csrLeaderboardService.updateLeaderboard();
    res.json({ message: 'Leaderboard updated successfully' });
  } catch (error) {
    console.error('Update leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 