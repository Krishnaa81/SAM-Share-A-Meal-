const CsrTransaction = require('../models/CsrTransaction');
const User = require('../models/User');
const { validateObjectId } = require('../utils/validation');
const csrService = require('../services/csr.service');
const paymentService = require('../services/payment.service');
const fs = require('fs');
const path = require('path');

// @desc    Create a new CSR transaction
// @route   POST /api/csr/transactions
// @access  Private (Corporate)
const createTransaction = async (req, res) => {
  try {
    const {
      transactionType,
      amount,
      recipient,
      purpose,
      description,
      category,
      paymentMethod,
      taxCreditPercentage = 50,
      fiscalYear = csrService.getCurrentFiscalYear()
    } = req.body;

    // Validate corporate user
    if (req.user.role !== 'corporate') {
      return res.status(403).json({ message: 'Only corporate users can create CSR transactions' });
    }

    // Calculate tax credit
    const taxCredit = csrService.calculateTaxCredit(amount, taxCreditPercentage);

    // Create transaction
    const transaction = new CsrTransaction({
      corporate: req.user._id,
      transactionType,
      amount,
      taxCredit,
      taxCreditPercentage,
      recipient,
      purpose,
      description,
      category,
      paymentMethod,
      fiscalYear,
      status: 'pending' // Initial status
    });

    // If payment method is online, create a payment link
    if (paymentMethod !== 'cheque' && paymentMethod !== 'bank_transfer') {
      try {
        const paymentLink = await paymentService.createPaymentLink({
          amount: amount,
          currency: 'INR',
          description: `CSR Contribution - ${purpose}`,
          customer: {
            name: req.user.companyName || req.user.name,
            email: req.user.email,
            contact: req.user.phone
          },
          notes: {
            transactionId: transaction._id.toString(),
            transactionType,
            purpose,
            category
          },
          callback_url: `${process.env.FRONTEND_URL}/csr/payment-complete?transactionId=${transaction._id}`
        });

        // Add payment link details to transaction
        transaction.paymentDetails = {
          provider: 'razorpay',
          paymentLinkId: paymentLink.id,
          paymentLinkUrl: paymentLink.short_url
        };
      } catch (paymentError) {
        console.error('Payment link creation error:', paymentError);
        return res.status(500).json({ 
          message: 'Error creating payment link',
          error: paymentError.message
        });
      }
    }

    await transaction.save();

    res.status(201).json({ 
      message: 'CSR transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create CSR transaction error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all CSR transactions for a corporate
// @route   GET /api/csr/transactions
// @access  Private (Corporate)
const getTransactions = async (req, res) => {
  try {
    const {
      status,
      fiscalYear = csrService.getCurrentFiscalYear(),
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Validate corporate user
    if (req.user.role !== 'corporate') {
      return res.status(403).json({ message: 'Only corporate users can view their CSR transactions' });
    }

    // Build filter object
    const filter = { corporate: req.user._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (fiscalYear) {
      filter.fiscalYear = fiscalYear;
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const total = await CsrTransaction.countDocuments(filter);

    // Get transactions with pagination and sorting
    const transactions = await CsrTransaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Get yearly totals
    const yearlyTotals = await csrService.getYearlyContributionTotal(req.user._id, fiscalYear);

    res.json({
      transactions,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
      yearlyTotals
    });
  } catch (error) {
    console.error('Get CSR transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get CSR transaction by ID
// @route   GET /api/csr/transactions/:id
// @access  Private (Corporate)
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await CsrTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check authorization
    if (
      transaction.corporate.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get CSR transaction by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update CSR transaction status
// @route   PUT /api/csr/transactions/:id/status
// @access  Private (Admin)
const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    // Only admin can update transaction status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update transaction status' });
    }

    const transaction = await CsrTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate status transition
    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status
    transaction.status = status;
    
    // Add note if provided
    if (note) {
      if (!transaction.notes) {
        transaction.notes = '';
      }
      transaction.notes += `\n[${new Date().toISOString()}] Status updated to ${status}: ${note}`;
    }

    // If status is completed and no receipt has been generated, generate one
    if (status === 'completed' && !transaction.acknowledgement?.receiptNumber) {
      try {
        const receiptPath = await csrService.generateTransactionReceipt(transaction._id);
        // Receipt details will be updated inside the service function
      } catch (receiptError) {
        console.error('Receipt generation error:', receiptError);
        // Continue without stopping the status update
      }
    }

    await transaction.save();

    res.json({
      message: `Transaction status updated to ${status}`,
      transaction
    });
  } catch (error) {
    console.error('Update CSR transaction status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify CSR payment
// @route   POST /api/csr/transactions/:id/verify-payment
// @access  Private (Corporate)
const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_signature } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await CsrTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check authorization
    if (transaction.corporate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to verify this payment' });
    }

    // Verify payment signature if available
    if (razorpay_payment_id && razorpay_signature) {
      const isValid = paymentService.verifyPaymentSignature({
        razorpay_order_id: transaction.paymentDetails?.transactionId,
        razorpay_payment_id,
        razorpay_signature
      });

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    }

    // Update transaction with payment details
    transaction.status = 'completed';
    transaction.paymentDetails = {
      ...transaction.paymentDetails,
      transactionId: razorpay_payment_id,
      paymentDate: new Date()
    };

    await transaction.save();

    // Generate receipt
    try {
      const receiptPath = await csrService.generateTransactionReceipt(transaction._id);
    } catch (receiptError) {
      console.error('Receipt generation error:', receiptError);
      // Continue without stopping the verification
    }

    res.json({
      message: 'Payment verified successfully',
      transaction
    });
  } catch (error) {
    console.error('Verify CSR payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate tax certificate for corporate
// @route   POST /api/csr/tax-certificate
// @access  Private (Corporate)
const generateTaxCertificate = async (req, res) => {
  try {
    const { fiscalYear = csrService.getCurrentFiscalYear() } = req.body;

    // Validate corporate user
    if (req.user.role !== 'corporate') {
      return res.status(403).json({ message: 'Only corporate users can generate tax certificates' });
    }

    // Check if there are completed transactions
    const transactionCount = await CsrTransaction.countDocuments({
      corporate: req.user._id,
      fiscalYear,
      status: 'completed'
    });

    if (transactionCount === 0) {
      return res.status(404).json({ 
        message: 'No completed transactions found for the specified fiscal year'
      });
    }

    // Generate certificate
    try {
      const certificatePath = await csrService.generateYearlyTaxCertificate(req.user._id, fiscalYear);
      
      res.json({
        message: 'Tax certificate generated successfully',
        certificateId: path.basename(certificatePath, '.pdf'),
        downloadUrl: `/api/csr/certificates/${path.basename(certificatePath, '.pdf')}`
      });
    } catch (certError) {
      console.error('Certificate generation error:', certError);
      res.status(500).json({ 
        message: 'Error generating tax certificate',
        error: certError.message
      });
    }
  } catch (error) {
    console.error('Generate tax certificate error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download receipt
// @route   GET /api/csr/receipts/:receiptNumber
// @access  Private (Corporate, Admin)
const downloadReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    
    // Find transaction by receipt number
    const transaction = await CsrTransaction.findOne({
      'acknowledgement.receiptNumber': receiptNumber
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Check authorization
    if (
      transaction.corporate.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to download this receipt' });
    }

    const receiptPath = path.join(__dirname, '../uploads/receipts', `${receiptNumber}.pdf`);

    // Check if file exists
    if (!fs.existsSync(receiptPath)) {
      // Try to regenerate
      try {
        await csrService.generateTransactionReceipt(transaction._id);
      } catch (genError) {
        return res.status(404).json({ message: 'Receipt file not found and could not be regenerated' });
      }
    }

    res.download(receiptPath, `${receiptNumber}.pdf`);
  } catch (error) {
    console.error('Download receipt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download tax certificate
// @route   GET /api/csr/certificates/:certificateId
// @access  Private (Corporate, Admin)
const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    // Find transaction by certificate ID
    const transaction = await CsrTransaction.findOne({
      'taxDocuments.certificateId': certificateId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Check authorization
    if (
      transaction.corporate.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to download this certificate' });
    }

    const certificatePath = path.join(__dirname, '../uploads/certificates', `${certificateId}.pdf`);

    // Check if file exists
    if (!fs.existsSync(certificatePath)) {
      // Try to regenerate
      try {
        await csrService.generateYearlyTaxCertificate(transaction.corporate, transaction.fiscalYear);
      } catch (genError) {
        return res.status(404).json({ message: 'Certificate file not found and could not be regenerated' });
      }
    }

    res.download(certificatePath, `${certificateId}.pdf`);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get CSR dashboard stats
// @route   GET /api/csr/dashboard
// @access  Private (Corporate)
const getDashboardStats = async (req, res) => {
  try {
    // Validate corporate user
    if (req.user.role !== 'corporate') {
      return res.status(403).json({ message: 'Only corporate users can access CSR dashboard' });
    }

    const currentFiscalYear = csrService.getCurrentFiscalYear();
    const previousFiscalYear = (() => {
      const [startYear, endYear] = currentFiscalYear.split('-').map(Number);
      return `${startYear - 1}-${endYear - 1}`;
    })();

    // Get current year stats
    const currentYearStats = await csrService.getYearlyContributionTotal(req.user._id, currentFiscalYear);
    
    // Get previous year stats
    const previousYearStats = await csrService.getYearlyContributionTotal(req.user._id, previousFiscalYear);
    
    // Get contribution breakdown by category
    const categoryBreakdown = await CsrTransaction.aggregate([
      {
        $match: {
          corporate: req.user._id,
          fiscalYear: currentFiscalYear,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Get recent transactions
    const recentTransactions = await CsrTransaction.find({
      corporate: req.user._id
    })
    .sort('-createdAt')
    .limit(5)
    .select('transactionType amount status createdAt purpose category');
    
    // Check for pending receipts/certificates
    const pendingDocuments = await CsrTransaction.countDocuments({
      corporate: req.user._id,
      status: 'completed',
      $or: [
        { 'acknowledgement.receiptNumber': { $exists: false } },
        { 'taxDocuments.certificateId': { $exists: false } }
      ]
    });

    res.json({
      currentFiscalYear,
      previousFiscalYear,
      currentYearStats,
      previousYearStats,
      yearOverYearChange: {
        contribution: currentYearStats.totalContribution - previousYearStats.totalContribution,
        taxCredit: currentYearStats.totalTaxCredit - previousYearStats.totalTaxCredit,
        percentage: previousYearStats.totalContribution ? 
          ((currentYearStats.totalContribution - previousYearStats.totalContribution) / previousYearStats.totalContribution) * 100 : 
          100
      },
      categoryBreakdown,
      recentTransactions,
      pendingDocuments
    });
  } catch (error) {
    console.error('Get CSR dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  verifyPayment,
  generateTaxCertificate,
  downloadReceipt,
  downloadCertificate,
  getDashboardStats
}; 