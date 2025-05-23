const express = require('express');
const { createRating, updateRating } = require('../controllers/rating.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/createRating', authenticate, authorize('USER','ADMIN'), createRating);
router.post('/updateRating', authenticate, authorize('USER','ADMIN'), updateRating);

module.exports = router;
