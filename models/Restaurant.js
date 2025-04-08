const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 20
  }
});

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  cuisineType: [{
    type: String,
    required: true
  }],
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    website: String
  },
  businessHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  images: [{
    type: String
  }],
  logo: {
    type: String
  },
  menuCategories: [{
    name: String,
    description: String
  }],
  featuredItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  deliveryOptions: {
    selfPickup: {
      type: Boolean,
      default: true
    },
    delivery: {
      type: Boolean,
      default: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    estimatedDeliveryTime: {
      min: Number,
      max: Number
    },
    deliveryRadius: {
      type: Number,
      default: 5 // in kilometers
    }
  },
  paymentOptions: {
    cash: {
      type: Boolean,
      default: true
    },
    creditCard: {
      type: Boolean,
      default: true
    },
    upi: {
      type: Boolean,
      default: true
    }
  },
  tags: [{
    type: String
  }],
  specialFeatures: [{
    type: String
  }],
  businessLicense: {
    number: String,
    expiryDate: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  fssaiLicense: {
    number: String,
    expiryDate: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionDetails: {
    startDate: Date,
    endDate: Date,
    autoRenewal: {
      type: Boolean,
      default: false
    },
    paymentId: String
  },
  commissionRate: {
    type: Number,
    default: 10 // Percentage
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  gstDetails: {
    gstNumber: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    totalCustomers: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Add indexes for performance
restaurantSchema.index({ name: 'text', 'address.city': 'text', cuisineType: 1 });
restaurantSchema.index({ 'address.city': 1, 'address.state': 1 });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ isActive: 1 });

// Virtual for full address
restaurantSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to check if restaurant is open at a given time
restaurantSchema.methods.isOpenNow = function() {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  
  const hours = this.businessHours[today];
  if (hours.isClosed) return false;
  
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(hours.open.replace(':', ''));
  const closeTime = parseInt(hours.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant; 