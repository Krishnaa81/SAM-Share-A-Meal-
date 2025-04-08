const mongoose = require('mongoose');

const facilitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const slotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookingDate: {
    type: Date
  },
  price: {
    type: Number,
    required: true
  }
});

const cloudKitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
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
    country: {
      type: String,
      required: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  coverImage: {
    type: String,
    default: ''
  },
  facilities: [facilitiesSchema],
  totalCapacity: {
    type: Number, // Number of cooking stations
    required: true
  },
  availableCapacity: {
    type: Number,
    required: true
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  slots: {
    monday: [slotSchema],
    tuesday: [slotSchema],
    wednesday: [slotSchema],
    thursday: [slotSchema],
    friday: [slotSchema],
    saturday: [slotSchema],
    sunday: [slotSchema]
  },
  pricing: {
    hourly: {
      type: Number,
      required: true
    },
    daily: {
      type: Number,
      required: true
    },
    weekly: {
      type: Number,
      required: true
    },
    monthly: {
      type: Number,
      required: true
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'basic'
    },
    isActive: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    features: [String]
  },
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
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    documents: [{
      type: String
    }],
    licenseNumber: String,
    certifications: [String]
  },
  bookingHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: Date,
    endDate: Date,
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    }
  }],
  virtualRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create index for geo-spatial queries
cloudKitchenSchema.index({ location: '2dsphere' });

const CloudKitchen = mongoose.model('CloudKitchen', cloudKitchenSchema);

module.exports = CloudKitchen; 