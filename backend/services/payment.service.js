const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a new Razorpay order
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Amount in rupees
 * @param {string} orderData.currency - Currency code (default: INR)
 * @param {string} orderData.receipt - Order receipt ID
 * @param {Object} orderData.notes - Additional notes
 * @returns {Promise<Object>} - Razorpay order object
 */
const createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt,
      notes: orderData.notes || {}
    };

    return await razorpay.orders.create(options);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error(`Payment gateway error: ${error.message}`);
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.razorpay_order_id - Razorpay order ID
 * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
 * @param {string} paymentData.razorpay_signature - Razorpay signature
 * @returns {boolean} - Whether the signature is valid
 */
const verifyPaymentSignature = (paymentData) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    // Creating the hmac object
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    
    // Passing the data to be hashed
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    hmac.update(data);
    
    // Creating the hmac in the required format
    const generatedSignature = hmac.digest('hex');
    
    // Comparing the signatures
    return generatedSignature === razorpay_signature;
  } catch (error) {
    console.error('Payment signature verification error:', error);
    return false;
  }
};

/**
 * Process a refund
 * @param {string} paymentId - Razorpay payment ID
 * @param {Object} refundData - Refund data
 * @param {number} refundData.amount - Amount to refund in rupees
 * @param {boolean} refundData.speed - Speed of refund ('normal' or 'optimum')
 * @param {string} refundData.notes - Notes for the refund
 * @returns {Promise<Object>} - Refund details
 */
const processRefund = async (paymentId, refundData) => {
  try {
    const options = {
      amount: refundData.amount * 100, // Convert to paise
      speed: refundData.speed || 'normal',
      notes: refundData.notes || {}
    };

    return await razorpay.payments.refund(paymentId, options);
  } catch (error) {
    console.error('Refund processing error:', error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};

/**
 * Create a subscription plan
 * @param {Object} planData - Plan data
 * @param {string} planData.period - Billing period (daily, weekly, monthly, yearly)
 * @param {number} planData.interval - Billing interval
 * @param {Object} planData.item - Plan item details
 * @returns {Promise<Object>} - Plan details
 */
const createSubscriptionPlan = async (planData) => {
  try {
    return await razorpay.plans.create(planData);
  } catch (error) {
    console.error('Subscription plan creation error:', error);
    throw new Error(`Failed to create subscription plan: ${error.message}`);
  }
};

/**
 * Create a subscription
 * @param {Object} subscriptionData - Subscription data
 * @param {string} subscriptionData.plan_id - Plan ID
 * @param {number} subscriptionData.total_count - Total number of billings
 * @param {Object} subscriptionData.customer_notify - Customer notification settings
 * @param {Object} subscriptionData.notes - Additional notes
 * @returns {Promise<Object>} - Subscription details
 */
const createSubscription = async (subscriptionData) => {
  try {
    return await razorpay.subscriptions.create(subscriptionData);
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {boolean} cancelAtCycleEnd - Whether to cancel at cycle end
 * @returns {Promise<Object>} - Cancellation details
 */
const cancelSubscription = async (subscriptionId, cancelAtCycleEnd = false) => {
  try {
    return await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

/**
 * Generate a payment link for an order
 * @param {Object} linkData - Payment link data
 * @param {number} linkData.amount - Amount in rupees
 * @param {string} linkData.currency - Currency code
 * @param {string} linkData.description - Description
 * @param {Object} linkData.customer - Customer details
 * @param {Object} linkData.notes - Additional notes
 * @returns {Promise<Object>} - Payment link details
 */
const createPaymentLink = async (linkData) => {
  try {
    const options = {
      amount: linkData.amount * 100, // Convert to paise
      currency: linkData.currency || 'INR',
      accept_partial: false,
      description: linkData.description,
      customer: linkData.customer,
      notify: {
        email: true,
        sms: true
      },
      reminder_enable: true,
      notes: linkData.notes || {},
      callback_url: linkData.callback_url,
      callback_method: 'get'
    };

    return await razorpay.paymentLink.create(options);
  } catch (error) {
    console.error('Payment link creation error:', error);
    throw new Error(`Failed to create payment link: ${error.message}`);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  processRefund,
  createSubscriptionPlan,
  createSubscription,
  cancelSubscription,
  createPaymentLink
}; 