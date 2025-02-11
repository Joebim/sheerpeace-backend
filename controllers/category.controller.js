const Category = require('../models/category.model');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a category by ID with image details
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Fetch the category image URL
    const image = await Category.getCategoryImage(id);

    res.json({
      ...category,
      image: image ? `/uploads/${image}` : null, // Construct the image URL
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const [category] = await Category.create({
      name,
      image, // Reference to the uploads table
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const [category] = await Category.update(id, {
      name,
      image, // Update the image reference
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.delete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};