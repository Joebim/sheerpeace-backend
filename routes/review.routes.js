const express = require('express');
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/review.controller');
const {authMiddleware} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/:product_id', getProductReviews);
router.post('/:product_id', authMiddleware, addReview);
router.put('/update/:review_id', authMiddleware, updateReview);
router.delete('/delete/:review_id', authMiddleware, deleteReview);

module.exports = router;
