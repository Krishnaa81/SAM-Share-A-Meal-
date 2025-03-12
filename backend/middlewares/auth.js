const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is valid, but user not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
};

// Middleware to check if user has restaurant role
const restaurant = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, restaurant privileges required' });
  }
};

// Middleware to check if user has cloud_kitchen role
const cloudKitchen = (req, res, next) => {
  if (req.user && req.user.role === 'cloud_kitchen') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, cloud kitchen privileges required' });
  }
};

// Middleware to check if user has corporate role
const corporate = (req, res, next) => {
  if (req.user && req.user.role === 'corporate') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, corporate privileges required' });
  }
};

module.exports = { auth, admin, restaurant, cloudKitchen, corporate }; 