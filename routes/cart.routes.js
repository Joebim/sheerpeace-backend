const express = require('express');
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
} = require('../controllers/cart.controller');

const router = express.Router();

// Cart routes
router.get('/:userId', getCart);
router.post('/items', addItem);
router.put('/items/:cartItemId', updateItemQuantity);
router.delete('/items/:cartItemId', removeItem);

module.exports = router;