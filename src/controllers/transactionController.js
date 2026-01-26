const Transaction = require('../models/Transaction');
const Joi = require('joi');

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.status(200).json({
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if(!transaction) {
             res.status(404);
             throw new Error('Transaction not found');
        }

        // Make sure user owns the transaction
        if(transaction.user.toString() !== req.user.id && req.user.role !== 'admin') {
             res.status(401);
             throw new Error('Not authorized');
        }

        res.status(200).json({
            success: true,
            data: transaction
        });

    } catch (error) {
        next(error);
    }
}


// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res, next) => {
  // Joi Validation
  const schema = Joi.object({
      text: Joi.string().required(),
      amount: Joi.number().required(),
      type: Joi.string().valid('income', 'expense').required(),
      category: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
    if (error) {
        res.status(400);
        return next(new Error(error.details[0].message));
    }

  try {
    const { text, amount, type, category } = req.body;

    const transaction = await Transaction.create({
      text,
      amount,
      type,
      category,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    // Check user match
    if (transaction.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    // Check user match
    if (transaction.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
