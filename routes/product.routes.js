const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  createMultiple,
  updateProduct,
  deleteProduct,
  queryProducts
} = require('../controllers/product.controller');

const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/query', queryProducts);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.post('/multiple', authMiddleware, adminMiddleware, createMultiple);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
