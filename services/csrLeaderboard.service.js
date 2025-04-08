const Corporate = require('../models/Corporate');
const CsrTransaction = require('../models/CsrTransaction');

class CsrLeaderboardService {
  /**
   * Update leaderboard rankings for all corporates
   * @returns {Promise<void>}
   */
  static async updateLeaderboard() {
    try {
      // Get all corporates with their total contributions
      const corporateRankings = await CsrTransaction.aggregate([
        {
          $match: {
            status: 'completed',
            fiscalYear: this.getCurrentFiscalYear()
          }
        },
        {
          $group: {
            _id: '$corporate',
            totalContribution: { $sum: '$amount' },
            totalImpact: {
              $sum: {
                $add: [
                  { $ifNull: ['$impactMetrics.peopleServed', 0] },
                  { $multiply: [{ $ifNull: ['$impactMetrics.carbonFootprintReduced', 0] }, 0.5] },
                  { $multiply: [{ $ifNull: ['$impactMetrics.wasteReduced', 0] }, 0.3] }
                ]
              }
            }
          }
        },
        {
          $sort: {
            totalContribution: -1
          }
        }
      ]);

      // Update rankings for each corporate
      for (let i = 0; i < corporateRankings.length; i++) {
        const ranking = corporateRankings[i];
        const corporate = await Corporate.findOne({ user: ranking._id });

        if (corporate) {
          // Store previous rank before updating
          const previousRank = corporate.leaderboardRank.current;

          // Update corporate ranking
          corporate.leaderboardRank = {
            current: i + 1,
            previous: previousRank,
            change: previousRank ? previousRank - (i + 1) : 0
          };

          // Check and award badges based on new ranking
          await this.checkAndAwardBadges(corporate, ranking.totalContribution, ranking.totalImpact);

          await corporate.save();
        }
      }
    } catch (error) {
      console.error('Leaderboard update error:', error);
      throw error;
    }
  }

  /**
   * Get current leaderboard standings
   * @param {Number} limit - Number of top corporates to return
   * @returns {Promise<Array>} - Leaderboard data
   */
  static async getLeaderboard(limit = 10) {
    try {
      const leaderboard = await Corporate.find({
        isActive: true,
        verificationStatus: 'verified'
      })
      .sort({ 'leaderboardRank.current': 1 })
      .limit(limit)
      .select('name logo leaderboardRank impactMetrics badges')
      .lean();

      return leaderboard.map(corporate => ({
        ...corporate,
        rank: corporate.leaderboardRank.current,
        rankChange: corporate.leaderboardRank.change,
        trend: corporate.leaderboardRank.change > 0 ? 'up' : 
               corporate.leaderboardRank.change < 0 ? 'down' : 'stable'
      }));
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Check and award badges based on corporate's performance
   * @param {Object} corporate - Corporate document
   * @param {Number} totalContribution - Total contribution amount
   * @param {Number} totalImpact - Calculated impact score
   */
  static async checkAndAwardBadges(corporate, totalContribution, totalImpact) {
    const badges = [];

    // Contribution milestone badges
    const contributionMilestones = [
      { amount: 10000000, name: 'Bronze Contributor', icon: '🥉' },
      { amount: 25000000, name: 'Silver Contributor', icon: '🥈' },
      { amount: 50000000, name: 'Gold Contributor', icon: '🥇' },
      { amount: 100000000, name: 'Platinum Contributor', icon: '💎' }
    ];

    for (const milestone of contributionMilestones) {
      if (totalContribution >= milestone.amount) {
        const badgeExists = corporate.badges.some(b => b.name === milestone.name);
        if (!badgeExists) {
          badges.push({
            name: milestone.name,
            description: `Contributed over ₹${milestone.amount / 10000000} crores in CSR donations`,
            awardedDate: new Date(),
            icon: milestone.icon
          });
        }
      }
    }

    // Impact badges
    const impactMilestones = [
      { score: 1000, name: 'Impact Initiator', icon: '🌱' },
      { score: 5000, name: 'Impact Leader', icon: '🌿' },
      { score: 10000, name: 'Impact Champion', icon: '🌳' },
      { score: 25000, name: 'Impact Visionary', icon: '🌍' }
    ];

    for (const milestone of impactMilestones) {
      if (totalImpact >= milestone.score) {
        const badgeExists = corporate.badges.some(b => b.name === milestone.name);
        if (!badgeExists) {
          badges.push({
            name: milestone.name,
            description: `Achieved significant social and environmental impact`,
            awardedDate: new Date(),
            icon: milestone.icon
          });
        }
      }
    }

    // Special badges
    if (corporate.leaderboardRank.current === 1) {
      const topRankBadge = {
        name: 'CSR Champion',
        description: 'Achieved #1 position on the CSR leaderboard',
        awardedDate: new Date(),
        icon: '👑'
      };
      const badgeExists = corporate.badges.some(b => b.name === topRankBadge.name);
      if (!badgeExists) {
        badges.push(topRankBadge);
      }
    }

    // Add new badges to corporate
    if (badges.length > 0) {
      corporate.badges.push(...badges);
    }
  }

  /**
   * Get current fiscal year
   * @returns {String} - Fiscal year in YYYY-YYYY format
   */
  static getCurrentFiscalYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0-indexed
    
    if (currentMonth >= 4) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  }
}

module.exports = CsrLeaderboardService; 