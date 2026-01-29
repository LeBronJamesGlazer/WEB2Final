const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
