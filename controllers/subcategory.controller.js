const Subcategory = require('../models/subcategory.model');

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.getAll();
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.getById(id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category_id, image } = req.body;
    const [subcategory] = await Subcategory.create({ name, category_id, image });
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, image } = req.body;
    const [subcategory] = await Subcategory.update(id, { name, category_id, image });
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.delete(id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create multiple subcategories
exports.createMultipleSubcategories = async (req, res) => {
  try {
    const subcategories = req.body;
    if (!Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Expected an array of subcategories.' });
    }
    const newSubcategories = await Subcategory.createMultiple(subcategories);
    res.status(201).json(newSubcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};