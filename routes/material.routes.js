const express = require('express');
const {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/material.controller');

const router = express.Router();

// Material routes
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;