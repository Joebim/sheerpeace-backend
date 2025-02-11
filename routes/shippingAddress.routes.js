const express = require('express');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/shippingAddress.controller');

const router = express.Router();

// Shipping address routes
router.get('/:userId', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;