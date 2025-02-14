const express = require('express');
const {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createMultipleSubcategories,
} = require('../controllers/subcategory.controller');

const router = express.Router();

// Subcategory routes
router.get('/', getAllSubcategories);
router.get('/:id', getSubcategoryById);
router.post('/', createSubcategory);
router.post('/multiple', createMultipleSubcategories);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

module.exports = router;