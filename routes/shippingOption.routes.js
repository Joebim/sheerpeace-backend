const express = require('express');
const {
  getAllShippingOptions,
  getShippingOptionById,
  createShippingOption,
  updateShippingOption,
  deleteShippingOption,
} = require('../controllers/shippingOption.controller');

const router = express.Router();

// Shipping option routes
router.get('/', getAllShippingOptions);
router.get('/:id', getShippingOptionById);
router.post('/', createShippingOption);
router.put('/:id', updateShippingOption);
router.delete('/:id', deleteShippingOption);

module.exports = router;