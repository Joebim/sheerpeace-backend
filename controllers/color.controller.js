const Color = require('../models/color.model');

// Get All Colors
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.getAll();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Color by ID
exports.getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.getById(id);

    if (!color) {
      return res.status(404).json({ message: 'Color not found' });
    }

    res.json(color);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a New Color
exports.createColor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Color name is required' });

    const [newColor] = await Color.create(name);
    res.status(201).json({ message: 'Color created successfully', color: newColor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Color
exports.updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: 'Color name is required' });

    const [updatedColor] = await Color.update(id, name);
    if (!updatedColor) return res.status(404).json({ message: 'Color not found' });

    res.json({ message: 'Color updated successfully', color: updatedColor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Color
exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedColor] = await Color.delete(id);
    if (!deletedColor) return res.status(404).json({ message: 'Color not found' });

    res.json({ message: 'Color deleted successfully', color: deletedColor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

