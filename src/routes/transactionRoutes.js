const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction, updateTransaction, getTransaction, getReport } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.get('/report', protect, getReport);

router.route('/:id')
  .get(protect, getTransaction)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
