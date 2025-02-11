const express = require('express');
const {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  createPayment,
} = require('../controllers/order.controller');

const router = express.Router();

// Order routes
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/user/:userId', getOrdersByUserId);
router.post('/payments', createPayment);

module.exports = router;