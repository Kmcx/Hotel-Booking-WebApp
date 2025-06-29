const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, reviewController.createReview);
router.get('/:hotelId', reviewController.getReviewsByHotel);
router.get('/summary/:hotelId', reviewController.getReviewSummary);

module.exports = router;
