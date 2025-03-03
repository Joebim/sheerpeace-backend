const express = require('express');
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  deleteCart
} = require('../controllers/cart.controller');

const router = express.Router();
const {
  authMiddleware,
} = require("../middleware/auth.middleware");

// Cart routes
router.get('/', authMiddleware, getCart);
router.post('/items', authMiddleware, addItem);
router.put('/items/:cartItemId', authMiddleware, updateItemQuantity);
router.delete('/items/:cartItemId', authMiddleware, removeItem);
router.delete('/:id', authMiddleware, deleteCart);

module.exports = router;