const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { validateObjectId } = require('../utils/validation');
const paymentService = require('../services/payment.service');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      cloudKitchenId,
      items,
      deliveryAddress,
      contactPhone,
      paymentMethod,
      orderType,
      specialInstructions,
      scheduledDelivery,
      tip,
      discount,
      donationOption,
      isCorporateExpense,
      corporateDetails
    } = req.body;

    // Validate that either restaurantId or cloudKitchenId is provided
    if ((!restaurantId && !cloudKitchenId) || (restaurantId && cloudKitchenId)) {
      return res.status(400).json({
        message: 'Please provide either a restaurant ID or a cloud kitchen ID, but not both'
      });
    }

    // Get restaurant or cloud kitchen details
    let vendorId = restaurantId || cloudKitchenId;
    let vendorType = restaurantId ? 'restaurant' : 'cloudKitchen';
    let vendor;

    if (vendorType === 'restaurant') {
      vendor = await Restaurant.findById(vendorId);
    } else {
      // Add CloudKitchen model check here when implemented
      return res.status(400).json({ message: 'Cloud Kitchen service not implemented yet' });
    }

    if (!vendor) {
      return res.status(404).json({ message: `${vendorType.charAt(0).toUpperCase() + vendorType.slice(1)} not found` });
    }

    // Validate and enhance items with full details
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Please add at least one item to your order' });
    }

    // Get all menu item IDs to fetch in a single query
    const menuItemIds = items.map(item => item.menuItemId);
    
    // Fetch all menu items at once
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    
    // Create a map for quick access
    const menuItemsMap = menuItems.reduce((map, item) => {
      map[item._id.toString()] = item;
      return map;
    }, {});

    // Process order items with actual data
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = menuItemsMap[item.menuItemId];
      
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }

      // Calculate item total price including customizations
      let itemTotalPrice = menuItem.price * item.quantity;
      
      // Add customization prices if any
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach(custom => {
          if (custom.options && custom.options.length > 0) {
            custom.options.forEach(option => {
              itemTotalPrice += option.price * item.quantity;
            });
          }
        });
      }

      processedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        specialInstructions: item.specialInstructions || '',
        totalPrice: itemTotalPrice
      });

      subtotal += itemTotalPrice;
    }

    // Calculate other charges
    const taxRate = 0.18; // 18% GST
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    
    const deliveryFee = orderType === 'pickup' ? 0 : vendor.deliveryOptions?.deliveryFee || 40;
    
    const tipAmount = tip || 0;
    
    const discountAmount = discount?.amount || 0;
    
    const totalAmount = parseFloat((subtotal + taxAmount + deliveryFee + tipAmount - discountAmount).toFixed(2));

    // Create order object
    const orderData = {
      user: req.user._id,
      [vendorType]: vendorId,
      items: processedItems,
      deliveryAddress,
      contactPhone,
      subtotal,
      taxAmount,
      deliveryFee,
      tip: tipAmount,
      discount: {
        amount: discountAmount,
        code: discount?.code || '',
        description: discount?.description || ''
      },
      totalAmount,
      paymentMethod,
      orderType,
      specialInstructions: specialInstructions || '',
      scheduledDelivery: {
        isScheduled: !!scheduledDelivery,
        time: scheduledDelivery || null
      }
    };

    // Add donation option if provided
    if (donationOption && donationOption.isDonated) {
      orderData.donationOption = donationOption;
    }

    // Add corporate expense info if it's a corporate expense
    if (isCorporateExpense && corporateDetails) {
      orderData.isCorporateExpense = true;
      orderData.corporateDetails = corporateDetails;
    }

    // Create order in DB
    const order = new Order(orderData);
    await order.save();

    // If payment method is not cash, create Razorpay order
    let paymentOrder = null;
    if (paymentMethod !== 'cash') {
      try {
        paymentOrder = await paymentService.createRazorpayOrder({
          amount: totalAmount,
          currency: 'INR',
          receipt: `order_${order._id}`,
          notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString()
          }
        });

        // Update order with payment order ID
        order.paymentDetails = {
          ...order.paymentDetails,
          transactionId: paymentOrder.id,
          provider: 'razorpay'
        };
        await order.save();
      } catch (paymentError) {
        console.error('Payment order creation error:', paymentError);
        // We still return the order but with a warning
        return res.status(201).json({
          order,
          warning: 'Order created but payment gateway error occurred. Please try payment again.',
          error: paymentError.message
        });
      }
    }

    // Return the created order along with payment order if applicable
    res.status(201).json({
      order,
      paymentOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const {
      status,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { user: req.user._id };
    
    if (status) {
      filter.orderStatus = status;
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    // Get user orders with pagination and sorting
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('restaurant', 'name address.city')
      .populate('cloudKitchen', 'name address.city')
      .select('-__v');

    res.json({
      orders,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id)
      .populate('restaurant', 'name address contactInfo.phone businessHours')
      .populate('cloudKitchen', 'name address contactInfo.phone businessHours')
      .populate('deliveryPerson', 'name phone currentLocation')
      .populate('items.menuItem', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized to view this order
    if (
      order.user.toString() !== req.user._id.toString() &&
      (order.restaurant && order.restaurant.owner.toString() !== req.user._id.toString()) &&
      (order.cloudKitchen && order.cloudKitchen.owner.toString() !== req.user._id.toString()) &&
      (order.deliveryPerson && order.deliveryPerson._id.toString() !== req.user._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Restaurant Owner, Delivery Person, Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization based on the requested status change
    const isRestaurantOwner = order.restaurant && req.user.role === 'restaurant';
    const isDeliveryPerson = order.deliveryPerson && order.deliveryPerson.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRestaurantOwner && !isDeliveryPerson && !isAdmin && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Validate status transitions
    const validStatusTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['out_for_delivery', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: []
    };

    if (!validStatusTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change order status from ${order.orderStatus} to ${status}`
      });
    }

    // Handle cancellation
    if (status === 'cancelled') {
      if (!reason) {
        return res.status(400).json({ message: 'Cancellation reason is required' });
      }

      order.cancellation = {
        reason,
        cancelledBy: req.user.role === 'admin' ? 'system' : (order.user.toString() === req.user._id.toString() ? 'user' : 'restaurant'),
        refundAmount: order.paymentStatus === 'paid' ? order.totalAmount : 0,
        refundStatus: order.paymentStatus === 'paid' ? 'pending' : null
      };

      // Process refund if payment was made
      if (order.paymentStatus === 'paid' && order.paymentDetails?.transactionId) {
        try {
          const refund = await paymentService.processRefund(order.paymentDetails.transactionId, {
            amount: order.totalAmount,
            notes: {
              orderId: order._id.toString(),
              reason: reason
            }
          });
          
          order.cancellation.refundStatus = 'processed';
          order.paymentStatus = 'refunded';
        } catch (refundError) {
          console.error('Refund processing error:', refundError);
          // Continue with cancellation but note the refund issue
          order.cancellation.refundStatus = 'failed';
        }
      }
    }

    // Update delivery status if the order status is related to delivery
    if (status === 'out_for_delivery') {
      order.deliveryStatus = 'in_transit';
      
      // Add tracking entry
      order.deliveryTracking.push({
        status: 'picked_up',
        description: 'Order has been picked up and is on the way',
        // Location would be set if provided in the request
        location: req.body.location || {}
      });
    } else if (status === 'delivered') {
      order.deliveryStatus = 'delivered';
      
      // Add final tracking entry
      order.deliveryTracking.push({
        status: 'delivered',
        description: 'Order has been delivered successfully',
        location: req.body.location || {}
      });
    }

    // Update order status
    order.orderStatus = status;
    
    // If status is confirmed and there's no estimated delivery time yet, set it
    if (status === 'confirmed' && !order.estimatedDeliveryTime) {
      const preparationTime = 30; // minutes (this could be from the restaurant settings)
      const deliveryTime = 15; // minutes (this could be calculated based on distance)
      
      const estimatedTime = new Date();
      estimatedTime.setMinutes(estimatedTime.getMinutes() + preparationTime + deliveryTime);
      
      order.estimatedDeliveryTime = estimatedTime;
    }

    await order.save();

    // TODO: Send notification to user about status change
    // This would integrate with a notification service

    res.json({
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify that this is the user's order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify payment signature
    const isValid = paymentService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order with payment details
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      ...order.paymentDetails,
      transactionId: razorpay_payment_id,
      provider: 'razorpay'
    };

    // If order was pending, update to confirmed
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
      
      // Set estimated delivery time if not already set
      if (!order.estimatedDeliveryTime) {
        const preparationTime = 30; // minutes
        const deliveryTime = 15; // minutes
        
        const estimatedTime = new Date();
        estimatedTime.setMinutes(estimatedTime.getMinutes() + preparationTime + deliveryTime);
        
        order.estimatedDeliveryTime = estimatedTime;
      }
    }

    await order.save();

    // TODO: Send notification to restaurant about new confirmed order
    // This would integrate with a notification service

    res.json({
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Rate and review order
// @route   POST /api/orders/:id/rate
// @access  Private
const rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodRating, foodComment, deliveryRating, deliveryComment } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify that this is the user's order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify that the order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ message: 'Can only rate delivered orders' });
    }

    // Update order with ratings
    order.ratings = {
      food: {
        rating: foodRating,
        comment: foodComment || ''
      },
      delivery: {
        rating: deliveryRating,
        comment: deliveryComment || ''
      }
    };

    await order.save();

    // Update restaurant ratings
    if (order.restaurant) {
      const restaurant = await Restaurant.findById(order.restaurant);
      
      if (restaurant) {
        // Calculate new average rating
        const newAvgRating = ((restaurant.ratings.average * restaurant.ratings.count) + foodRating) / (restaurant.ratings.count + 1);
        
        restaurant.ratings.average = parseFloat(newAvgRating.toFixed(1));
        restaurant.ratings.count += 1;
        
        await restaurant.save();
      }
    }

    // TODO: Similarly update cloud kitchen ratings if applicable

    res.json({
      message: 'Order rated successfully',
      order
    });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  rateOrder
}; 