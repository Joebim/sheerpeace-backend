const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  createMultiple,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:product_id', getProductById);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.post('/multiple', authMiddleware, adminMiddleware, createMultiple);
router.put('/:product_id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:product_id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
