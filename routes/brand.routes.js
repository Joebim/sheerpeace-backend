const express = require('express');
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  createMultipleBrands,
} = require('../controllers/brand.controller');

const router = express.Router();

// Brand routes
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.post('/', createBrand);
router.post('/multiple', createMultipleBrands);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;