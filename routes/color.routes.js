const express = require('express');
const {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
  createMultipleColors,
} = require('../controllers/color.controller');

const router = express.Router();

router.get('/', getAllColors); // Get all colors
router.get('/:id', getColorById); // Get single color by ID
router.post('/', createColor); // Create a new color
router.post('/multiple', createMultipleColors); // Create a new color
router.put('/:id', updateColor); // Update color
router.delete('/:id', deleteColor); // Delete color

module.exports = router;
