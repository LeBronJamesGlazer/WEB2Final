const Transaction = require('../models/Transaction');

// @desc    Get premium content (Real Analytics)
// @route   GET /api/premium/content
// @access  Private/Premium
const getPremiumContent = async (req, res, next) => {
  try {
    // 1. Fetch all user transactions
    const transactions = await Transaction.find({ user: req.user.id });

    // 2. Process data: Group by month for the last 6 months
    const monthlyData = {};
    const today = new Date();
    
    // Initialize last 6 months in object
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        monthlyData[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const d = new Date(t.createdAt);
        // Only consider last 6 months approx
        if (d > new Date(today.getFullYear(), today.getMonth() - 6, 1)) {
            const key = d.toLocaleString('default', { month: 'short' });
            if (monthlyData[key]) {
                if (t.type === 'income') monthlyData[key].income += t.amount;
                if (t.type === 'expense') monthlyData[key].expense += t.amount;
            }
        }
    });

    // 3. Simple Forecast (Next Month) = Average of last 3 months expenses
    const keys = Object.keys(monthlyData);
    let last3MonthsExpense = 0;
    let count = 0;
    for(let i=3; i<6; i++) {
        if(keys[i]) {
            last3MonthsExpense += monthlyData[keys[i]].expense;
            count++;
        }
    }
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