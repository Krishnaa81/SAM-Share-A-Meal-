const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

// Simple route to return all orders 
router.get('/', auth, (req, res) => {
  // Mock response for now
  res.json({
    success: true,
    message: 'Orders route is working',
    data: []
  });
});

// Get order by ID
router.get('/:id', auth, (req, res) => {
  // Mock response for now
  res.json({
    success: true,
    message: `Order ${req.params.id} details`,
    data: {
      id: req.params.id,
      status: 'pending',
      items: [],
      totalAmount: 0
    }
  });
});

module.exports = router; 