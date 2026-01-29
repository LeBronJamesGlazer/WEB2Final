const express = require('express');
const router = express.Router();
const { getPremiumContent } = require('../controllers/premiumController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/content', protect, authorize('premium', 'admin'), getPremiumContent);

module.exports = router;
