const Size = require('../models/size.model');

// Get all sizes
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.getAll();
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a size by ID
exports.getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const size = await Size.getById(id);
    if (size) {
      res.json(size);
    } else {
      res.status(404).json({ error: 'Size not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new size
exports.createSize = async (req, res) => {
  const data = req.body;
  try {
    const newSize = await Size.create(data);
    res.status(201).json(newSize[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing size
exports.updateSize = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedSize = await Size.update(id, data);
    if (updatedSize.length > 0) {
      res.json(updatedSize[0]);
    } else {
      res.status(404).json({ error: 'Size not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a size
exports.deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await Size.delete(id);
    if (deletedCount > 0) {
      res.json({ message: 'Size deleted successfully' });
    } else {
      res.status(404).json({ error: 'Size not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
