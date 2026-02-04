const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserAccount, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

// Admin only route example
router.route('/')
    .get(protect, authorize('admin'), getUsers);

module.exports = router;
