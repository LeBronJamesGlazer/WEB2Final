const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin only route example
router.route('/')
    .get(protect, authorize('admin'), getUsers);

module.exports = router;
