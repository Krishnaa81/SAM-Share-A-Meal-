const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant.menu',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
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
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'wallet'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusUpdates: [{
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  deliveryInstructions: {
    type: String,
    default: ''
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryRating: {
    type: Number,
    min: 1,
    max: 5
  },
  foodRating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  isRated: {
    type: Boolean,
    default: false
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 