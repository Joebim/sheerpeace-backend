const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createMultipleCategories,
} = require('../controllers/category.controller');

const router = express.Router();

// Category routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.post('/multiple', createMultipleCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;