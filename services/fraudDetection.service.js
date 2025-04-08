const CsrTransaction = require('../models/CsrTransaction');
const Corporate = require('../models/Corporate');

/**
 * AI-based fraud detection service for CSR contributions
 */
class FraudDetectionService {
  /**
   * Check for suspicious patterns in CSR transactions
   * @param {String} corporateId - ID of the corporate entity
   * @param {Object} transaction - New transaction to be verified
   * @returns {Object} - Fraud detection results
   */
  static async analyzeTransaction(corporateId, transaction) {
    try {
      // Get corporate's transaction history
      const historicalTransactions = await CsrTransaction.find({
        corporate: corporateId,
        status: 'completed'
      }).sort('-createdAt').limit(10);

      const corporate = await Corporate.findOne({ user: corporateId });
      
      // Fraud detection rules
      const suspiciousPatterns = [];

      // 1. Check for unusual transaction amounts
      const avgAmount = historicalTransactions.reduce((sum, t) => sum + t.amount, 0) / 
        (historicalTransactions.length || 1);
      
      if (transaction.amount > avgAmount * 3) {
        suspiciousPatterns.push({
          type: 'unusual_amount',
          severity: 'high',
          description: 'Transaction amount significantly higher than average'
        });
      }

      // 2. Check frequency of transactions
      if (historicalTransactions.length > 0) {
        const lastTransactionDate = new Date(historicalTransactions[0].createdAt);
        const timeDiff = Date.now() - lastTransactionDate.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          suspiciousPatterns.push({
            type: 'high_frequency',
            severity: 'medium',
            description: 'Multiple transactions within 24 hours'
          });
        }
      }

      // 3. Check if donation amount exceeds annual CSR budget
      if (corporate?.csrBudget) {
        const totalSpent = corporate.csrBudget.spentAmount || 0;
        if (totalSpent + transaction.amount > corporate.csrBudget.allocatedAmount) {
          suspiciousPatterns.push({
            type: 'budget_exceeded',
            severity: 'high',
            description: 'Transaction would exceed allocated CSR budget'
          });
        }
      }

      // 4. Check for round numbers (potential fake transactions)
      if (transaction.amount % 1000 === 0) {
        suspiciousPatterns.push({
          type: 'round_amount',
          severity: 'low',
          description: 'Transaction amount is suspiciously round'
        });
      }

      // 5. Check for duplicate transactions
      const potentialDuplicates = historicalTransactions.filter(t => 
        t.amount === transaction.amount &&
        t.recipient.name === transaction.recipient.name &&
        t.purpose === transaction.purpose
      );

      if (potentialDuplicates.length > 0) {
        suspiciousPatterns.push({
          type: 'potential_duplicate',
          severity: 'high',
          description: 'Similar transaction found in recent history'
        });
      }

      // Calculate risk score (0-100)
      const riskScore = this.calculateRiskScore(suspiciousPatterns);

      return {
        riskScore,
        suspiciousPatterns,
        requiresManualReview: riskScore > 70,
        recommendation: this.getRecommendation(riskScore)
      };
    } catch (error) {
      console.error('Fraud detection analysis error:', error);
      throw error;
    }
  }

  /**
   * Calculate risk score based on suspicious patterns
   * @param {Array} patterns - Array of suspicious patterns
   * @returns {Number} - Risk score (0-100)
   */
  static calculateRiskScore(patterns) {
    const severityWeights = {
      high: 30,
      medium: 20,
      low: 10
    };

    const totalScore = patterns.reduce((score, pattern) => {
      return score + severityWeights[pattern.severity];
    }, 0);

    // Normalize score to 0-100 range
    return Math.min(100, totalScore);
  }

  /**
   * Get recommendation based on risk score
   * @param {Number} riskScore - Calculated risk score
   * @returns {String} - Recommendation
   */
  static getRecommendation(riskScore) {
    if (riskScore > 70) {
      return 'Block transaction and require manual review';
    } else if (riskScore > 40) {
      return 'Flag for review but allow transaction';
    } else {
      return 'Process transaction normally';
    }
  }

  /**
   * Verify corporate's annual revenue requirement
   * @param {String} gstNumber - GST number of the corporate
   * @returns {Promise<Boolean>} - Whether the corporate meets the revenue requirement
   */
  static async verifyRevenueRequirement(gstNumber) {
    try {
      // TODO: Integrate with actual GST API
      // For now, returning mock verification
      return true;
    } catch (error) {
      console.error('Revenue verification error:', error);
      throw error;
    }
  }
}

module.exports = FraudDetectionService; 