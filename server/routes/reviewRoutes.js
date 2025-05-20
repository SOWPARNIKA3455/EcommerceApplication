const express = require('express');
const reviewRouter = express.Router();
const {addReview,getReviewsByProduct,deleteReview} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

reviewRouter.post('/:productId', protect, addReview);
reviewRouter.get('/:productId', getReviewsByProduct);
reviewRouter.delete('/:reviewId', protect, deleteReview);

module.exports = reviewRouter;
