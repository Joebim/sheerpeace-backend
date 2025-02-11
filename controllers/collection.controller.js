const Collection = require('../models/collection.model');

// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.getAll();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a collection by ID
exports.getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.getById(id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new collection
exports.createCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const [collection] = await Collection.create({ name, description, image });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a collection
exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const [collection] = await Collection.update(id, { name, description, image });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a collection
exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.delete(id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json({ message: 'Collection deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};