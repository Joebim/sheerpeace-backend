const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:product_id', getProductById);
router.post('/create', authMiddleware, adminMiddleware, createProduct);
router.put('/update/:product_id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/delete/:product_id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
