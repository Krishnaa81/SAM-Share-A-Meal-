const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.jwt;

    // Alternative: Check for token in Authorization header if not in cookies
    // This helps with testing and APIs that don't use cookies
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    const finalToken = token || headerToken;

    if (!finalToken) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      console.log('Verifying token...');
      const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
      console.log('Token verified for user ID:', decoded.id);
      
      // Find user by ID and exclude password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        console.log('User account not active:', user.email);
        return res.status(403).json({ message: 'Account is suspended or inactive' });
      }
      
      // Set user in request
      req.user = user;
      console.log('Authentication successful for user:', user.email);
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check for admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware to check for restaurant owner role
const restaurant = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a restaurant owner' });
  }
};

// Middleware to check for cloud kitchen owner role
const cloudKitchen = (req, res, next) => {
  if (req.user && req.user.role === 'cloud_kitchen') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a cloud kitchen owner' });
  }
};

// Middleware to check for delivery person role
const delivery = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a delivery person' });
  }
};

// Middleware to check for corporate user role
const corporate = (req, res, next) => {
  if (req.user && req.user.role === 'corporate') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a corporate user' });
  }
};

// Middleware to check for NGO role
const ngo = (req, res, next) => {
  if (req.user && req.user.role === 'ngo') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an NGO' });
  }
};

module.exports = { 
  auth, 
  admin, 
  restaurant, 
  cloudKitchen, 
  delivery,
  corporate,
  ngo
}; 