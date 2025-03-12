const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    console.log('Registration attempt:', { name, email, phone, role }); // Log registration attempt

    // Check if required fields are present
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (dbError) {
      console.error('Error checking existing user:', dbError);
      return res.status(500).json({ 
        message: 'Database error while checking user', 
        error: dbError.message 
      });
    }

    // Create a user object to validate without saving
    const userObj = new User({
      name,
      email,
      password,
      phone,
      role: role || 'user'
    });

    try {
      // Validate the user object
      const validationError = userObj.validateSync();
      if (validationError) {
        console.error('Validation error:', validationError);
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationError.errors 
        });
      }
    } catch (validationError) {
      console.error('Error during validation:', validationError);
      return res.status(400).json({ 
        message: 'Validation error', 
        error: validationError.message 
      });
    }

    try {
      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'user'
      });

      if (user) {
        console.log('User registered successfully:', user._id);
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        });
      } else {
        console.error('Failed to create user, no error thrown but user is null');
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (saveError) {
      console.error('Error saving user to database:', saveError);
      // Handle specific MongoDB errors
      if (saveError.name === 'MongoServerError' && saveError.code === 11000) {
        // Duplicate key error (likely email)
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ 
        message: 'Database error while creating user', 
        error: saveError.message,
        code: saveError.code,
        name: saveError.name
      });
    }
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile, updateProfile }; 