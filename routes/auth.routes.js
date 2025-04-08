const express = require('express');
const router = express.Router();
const { login, register, logout, getProfile } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes (require authentication)
router.use(auth);
router.get('/profile', getProfile);
router.post('/logout', logout);

module.exports = router; 