const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router; 