const express = require('express');
const router = express.Router();
const { 
  getMenuItems, 
  getTopSellingItems, 
  getMenuItemById, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} = require('../controllers/menuItem.controller');
const { auth } = require('../middlewares/auth');
const { isRestaurantOrCloudKitchen } = require('../middlewares/roleCheck');

// Public routes
router.get('/', getMenuItems);
router.get('/top-selling', getTopSellingItems);
router.get('/:id', getMenuItemById);

// Protected routes
router.post('/', auth, isRestaurantOrCloudKitchen, createMenuItem);
router.put('/:id', auth, isRestaurantOrCloudKitchen, updateMenuItem);
router.delete('/:id', auth, isRestaurantOrCloudKitchen, deleteMenuItem);

module.exports = router; 