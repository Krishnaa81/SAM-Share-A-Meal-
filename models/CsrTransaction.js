const mongoose = require('mongoose');

const csrTransactionSchema = new mongoose.Schema({
  corporate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['donation', 'sponsorship', 'direct_funding'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  taxCredit: {
    type: Number,
    required: true
  },
  taxCreditPercentage: {
    type: Number,
    default: 50, // Default 50% tax credit
    min: 0,
    max: 100
  },
  recipient: {
    type: {
      type: String,
      enum: ['ngo', 'initiative', 'direct_beneficiary'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipient.type'
    },
    name: String
  },
  purpose: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  attachments: [{
    type: String // URLs to stored documents
  }],
  category: {
    type: String,
    enum: ['hunger_relief', 'education', 'healthcare', 'sustainability', 'community_development', 'other'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'credit_card', 'cheque'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    provider: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  acknowledgement: {
    receiptNumber: String,
    issuedDate: Date,
    issuedBy: String
  },
  fiscalYear: {
    type: String,
    required: true
  },
  taxDocuments: {
    certificateId: String,
    issuedDate: Date,
    downloadUrl: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
csrTransactionSchema.index({ corporate: 1, fiscalYear: 1 });
csrTransactionSchema.index({ 'recipient.id': 1 });
csrTransactionSchema.index({ status: 1 });
csrTransactionSchema.index({ createdAt: 1 });

// Method to calculate tax credit
csrTransactionSchema.methods.calculateTaxCredit = function() {
  return (this.amount * this.taxCreditPercentage) / 100;
};

// Virtual for formatted fiscal year
csrTransactionSchema.virtual('formattedFiscalYear').get(function() {
  return `FY ${this.fiscalYear}`;
});

const CsrTransaction = mongoose.model('CsrTransaction', csrTransactionSchema);

module.exports = CsrTransaction; 