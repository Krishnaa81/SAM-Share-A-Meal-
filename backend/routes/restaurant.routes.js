const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  bulkUploadMenuItems
} = require('../controllers/restaurant.controller');
const { auth } = require('../middlewares/auth');
const { restaurant } = require('../middlewares/auth');

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes - Restaurant owners only
router.post('/', auth, restaurant, createRestaurant);
router.put('/:id', auth, restaurant, updateRestaurant);
router.delete('/:id', auth, restaurant, deleteRestaurant);
router.post('/:id/menu/bulk', auth, restaurant, bulkUploadMenuItems);

module.exports = router; 