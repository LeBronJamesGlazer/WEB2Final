const Transaction = require('../models/Transaction');

// @desc    Get premium content (Real Analytics)
// @route   GET /api/premium/content
// @access  Private/Premium
const getPremiumContent = async (req, res, next) => {
  try {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    // 1. Aggregation Pipeline
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // 2. Process data: Format for Chart
    const monthlyData = {};
    
    // Initialize last 6 months in object with 0
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        monthlyData[key] = { income: 0, expense: 0 };
    }

    // Fill with aggregation results
    stats.forEach(stat => {
        const d = new Date(stat._id.year, stat._id.month - 1, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        
        if (monthlyData[key]) {
            if (stat._id.type === 'income') monthlyData[key].income = stat.totalAmount;
            if (stat._id.type === 'expense') monthlyData[key].expense = stat.totalAmount;
        }
    });

    // 3. Simple Forecast (Next Month) = Average of last 3 months expenses
    const keys = Object.keys(monthlyData);
    let last3MonthsExpense = 0;
    let count = 0;
    
    // We want the *last* 3 entries in our data window
    const last3Keys = keys.slice(-3);
    
    last3Keys.forEach(key => {
        last3MonthsExpense += monthlyData[key].expense;
        count++;
    });

    const forecastExpense = count > 0 ? (last3MonthsExpense / count).toFixed(2) : 0;

    res.status(200).json({
      title: 'Premium Financial Analysis',
      description: `Based on your recent activity, we forecast your expenses next month to be roughly $${forecastExpense}. Below is your 6-month trend.`,
      chartLabels: Object.keys(monthlyData),
      chartDataIncome: Object.values(monthlyData).map(d => d.income),
      chartDataExpense: Object.values(monthlyData).map(d => d.expense)
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getPremiumContent };