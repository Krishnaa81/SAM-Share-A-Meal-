const mongoose = require('mongoose');

const csrDonationSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  taxBenefitAmount: {
    type: Number,
    required: true
  },
  certificateUrl: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDate: Date,
  verificationNotes: String
});

const corporateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String,
  logo: String,
  companyType: {
    type: String,
    enum: ['private', 'public', 'government', 'non-profit'],
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  registrationDate: {
    type: Date,
    required: true
  },
  annualRevenue: {
    type: Number,
    required: true,
    min: 50000000 // Minimum 5 crores in paisa (INR)
  },
  panNumber: {
    type: String,
    required: true,
    unique: true
  },
  gstNumber: {
    type: String,
    unique: true
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
  contactPerson: {
    name: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  documents: {
    registrationCertificate: String,
    panCard: String,
    gstCertificate: String,
    annualReport: String,
    csrPolicy: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  csrBudget: {
    financialYear: String,
    allocatedAmount: Number,
    spentAmount: Number,
    remainingAmount: Number
  },
  csrDonations: [csrDonationSchema],
  taxBenefits: {
    totalAmount: {
      type: Number,
      default: 0
    },
    financialYear: String,
    reports: [{
      year: String,
      quarter: String,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      documentUrl: String
    }]
  },
  impactMetrics: {
    totalFoodDonated: {
      type: Number,
      default: 0
    }, // in kg
    peopleServed: {
      type: Number,
      default: 0
    },
    carbonFootprintReduced: {
      type: Number,
      default: 0
    }, // in kg CO2
    wasteReduced: {
      type: Number,
      default: 0
    } // in kg
  },
  badges: [{
    name: String,
    description: String,
    awardedDate: Date,
    icon: String
  }],
  leaderboardRank: {
    current: {
      type: Number,
      default: 0
    },
    previous: {
      type: Number,
      default: 0
    },
    change: {
      type: Number,
      default: 0
    }
  },
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

const Corporate = mongoose.model('Corporate', corporateSchema);

module.exports = Corporate; 