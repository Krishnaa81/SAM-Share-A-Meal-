/**
 * Role-based middleware functions to check user permissions
 */

// Check if user is a restaurant or cloud kitchen owner
const isRestaurantOrCloudKitchen = (req, res, next) => {
  if (req.user && (req.user.role === 'restaurant' || req.user.role === 'cloud_kitchen')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, restaurant or cloud kitchen privileges required' });
  }
};

// Check if user is a corporate user
const isCorporate = (req, res, next) => {
  if (req.user && req.user.role === 'corporate') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, corporate privileges required' });
  }
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
};

// Check if user is a customer
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, customer privileges required' });
  }
};

module.exports = {
  isRestaurantOrCloudKitchen,
  isCorporate,
  isAdmin,
  isCustomer
}; 