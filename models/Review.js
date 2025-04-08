const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  // The review can be for a restaurant, cloud kitchen, or menu item
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  cloudKitchen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloudKitchen'
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure that the review is associated with exactly one entity
reviewSchema.pre('save', function(next) {
  const entityCount = [this.restaurant, this.cloudKitchen, this.menuItem].filter(Boolean).length;
  if (entityCount !== 1) {
    next(new Error('Review must be associated with exactly one entity (restaurant, cloud kitchen, or menu item)'));
  }
  next();
});

// Add indexes for better query performance
reviewSchema.index({ restaurant: 1, createdAt: -1 });
reviewSchema.index({ cloudKitchen: 1, createdAt: -1 });
reviewSchema.index({ menuItem: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 