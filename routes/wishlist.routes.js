const express = require('express');
const { getUserWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const {authMiddleware} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, getUserWishlist);
router.post('/add/:product_id', authMiddleware, addToWishlist);
router.delete('/remove/:product_id', authMiddleware, removeFromWishlist);

module.exports = router;
