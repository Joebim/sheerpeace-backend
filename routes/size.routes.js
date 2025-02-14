const express = require('express');
const {
  getAllSizes,
  getSizeById,
  createSize,
  createMultipleSizes,
  updateSize,
  deleteSize,
} = require('../controllers/size.controller');
const router = express.Router();

// Get all sizes
router.get('/', getAllSizes);

// Get a size by ID
router.get('/:id', getSizeById);

// Create a new size
router.post('/', createSize);
router.post('/multiple', createMultipleSizes);

// Update an existing size
router.put('/:id', updateSize);

// Delete a size
router.delete('/:id', deleteSize);

module.exports = router;
