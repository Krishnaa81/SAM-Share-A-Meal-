const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'restaurant', 'cloud_kitchen', 'corporate', 'delivery', 'admin', 'ngo'],
    default: 'user'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  profilePicture: {
    type: String,
    default: ''
  },
  // For OAuth
  googleId: String,
  facebookId: String,
  // For verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  // For restaurant/cloud kitchen owners
  businessName: String,
  businessLicense: String,
  cuisineTypes: [String],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  // For corporate users
  companyName: String,
  gstNumber: String,
  companySize: Number,
  annualRevenue: Number,
  // User activity
  lastLogin: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  // For delivery personnel
  vehicleType: String,
  vehicleNumber: String,
  drivingLicense: String,
  currentLocation: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    lastUpdated: Date
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  // User preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    dietary: {
      isVegetarian: Boolean,
      isVegan: Boolean,
      allergies: [String]
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    console.log('Hashing password in User model middleware...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Original password length:', this.password.length);
    console.log('Hashed password (first 15 chars):', hashedPassword.substring(0, 15) + '...');
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password in middleware:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    console.log('Comparing passwords...');
    console.log('Entered password length:', enteredPassword.length);
    console.log('Stored hashed password (first 15 chars):', this.password.substring(0, 15) + '...');
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Add index for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'address.city': 1, 'address.state': 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

const User = mongoose.model('User', userSchema);

module.exports = User; 