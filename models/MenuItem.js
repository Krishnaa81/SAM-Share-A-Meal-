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
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false
  },
  cloudKitchen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloudKitchen',
    required: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  allergens: [{
    type: String
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fats: Number,
    fiber: Number
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  customization: [{
    name: String,
    options: [{
      name: String,
      price: Number
    }]
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
  orderCount: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  trend: {
    type: Number,
    default: 0 // -1 for downward, 0 for stable, 1 for upward
  }
}, {
  timestamps: true
});

// Add index for category and restaurant/cloudKitchen for faster queries
menuItemSchema.index({ category: 1, restaurant: 1 });
menuItemSchema.index({ category: 1, cloudKitchen: 1 });

// Add index for search by name
menuItemSchema.index({ name: 'text', description: 'text' });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 