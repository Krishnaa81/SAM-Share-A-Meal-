const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT token settings
const TOKEN_EXPIRY = '30d';
const COOKIE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
};

// Set token in HTTP-only cookie
const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cross-site requests
    maxAge: COOKIE_EXPIRY,
    path: '/'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user' } = req.body;
    
    console.log('Registration attempt:', { name, email, phone, role }); // Log registration attempt

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    if (user) {
      console.log('User registered successfully:', user._id);
      // Generate token
      const token = generateToken(user._id);
      
      // Set HTTP-only cookie
      setTokenCookie(res, token);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      });
    } else {
      console.error('Failed to create user, no error thrown but user is null');
      res.status(400).json({ message: 'Invalid user data' });
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

    console.log('Login attempt:', { email }); // Log login attempt

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      console.log('Login failed: Account not active for user:', email);
      return res.status(403).json({ message: 'Account is suspended or inactive' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);
    
    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('Login successful for user:', email);

    // Also send token in response for clients that prefer token-based auth
    res.json({
      success: true,
      token: token, // Include token in response
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  try {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

      // Refresh token
      const token = generateToken(updatedUser._id);
      setTokenCookie(res, token);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google token
    // In a real implementation, you'd use the google-auth-library package
    // For now, we'll mock the verification and user creation
    
    // Mock decoded info from Google token
    const googleUser = {
      // This would come from Google's verification
      email: req.body.email,
      name: req.body.name,
      picture: req.body.picture,
      googleId: req.body.googleId
    };
    
    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: Math.random().toString(36).slice(-8), // Random password
        googleId: googleUser.googleId,
        profilePicture: googleUser.picture,
        phone: req.body.phone || '', // We may need to ask for phone separately
        isVerified: true // Google already verified the email
      });
    } else {
      // Update existing user with Google ID if not present
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.isVerified = true;
        await user.save();
      }
    }
    
    // Generate JWT token
    const authToken = generateToken(user._id);
    
    // Set HTTP-only cookie
    setTokenCookie(res, authToken);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// @desc    Facebook OAuth login/register
// @route   POST /api/auth/facebook
// @access  Public
const facebookAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Facebook token
    // In a real implementation, you'd use the facebook-node-sdk package
    // For now, we'll mock the verification and user creation
    
    // Mock decoded info from Facebook token
    const facebookUser = {
      // This would come from Facebook's verification
      email: req.body.email,
      name: req.body.name,
      picture: req.body.picture,
      facebookId: req.body.facebookId
    };
    
    // Check if user exists
    let user = await User.findOne({ email: facebookUser.email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: facebookUser.name,
        email: facebookUser.email,
        password: Math.random().toString(36).slice(-8), // Random password
        facebookId: facebookUser.facebookId,
        profilePicture: facebookUser.picture,
        phone: req.body.phone || '', // We may need to ask for phone separately
        isVerified: true // Facebook already verified the email
      });
    } else {
      // Update existing user with Facebook ID if not present
      if (!user.facebookId) {
        user.facebookId = facebookUser.facebookId;
        user.isVerified = true;
        await user.save();
      }
    }
    
    // Generate JWT token
    const authToken = generateToken(user._id);
    
    // Set HTTP-only cookie
    setTokenCookie(res, authToken);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Facebook auth error:', error.message);
    res.status(500).json({ message: 'Server error during Facebook authentication' });
  }
};

module.exports = { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile,
  googleAuth,
  facebookAuth 
}; 