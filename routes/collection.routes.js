const express = require('express');
const {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collection.controller');

const router = express.Router();

// Collection routes
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

module.exports = router;