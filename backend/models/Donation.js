const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodDetails: {
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'items', 'servings'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    images: [{
      type: String
    }],
    storageInstructions: String,
    allergenInfo: String
  },
  pickupAddress: {
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
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  preferredPickupTime: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'pickup_assigned', 'picked_up', 'delivered', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  },
  statusUpdates: [{
    status: {
      type: String,
      enum: ['pending', 'approved', 'pickup_assigned', 'picked_up', 'delivered', 'completed', 'cancelled', 'expired']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  pickupTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actualPickupTime: {
    type: Date
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  deliveryTime: {
    type: Date
  },
  donationType: {
    type: String,
    enum: ['individual', 'restaurant', 'corporate', 'event'],
    required: true
  },
  corporateInfo: {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Corporate'
    },
    csrId: String,
    taxBenefitAmount: Number
  },
  donationCertificate: {
    isGenerated: {
      type: Boolean,
      default: false
    },
    certificateId: String,
    generatedDate: Date,
    certificateUrl: String
  },
  impactStats: {
    peopleServed: Number,
    carbonFootprint: Number, // reduced carbon footprint in kg CO2
    foodWastePrevented: Number // in kg
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for geospatial queries
donationSchema.index({ 'pickupAddress.coordinates': '2dsphere' });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 