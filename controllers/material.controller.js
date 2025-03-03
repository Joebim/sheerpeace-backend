const Material = require('../models/material.model');

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.getAll();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.getById(id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new material
exports.createMaterial = async (req, res) => {
  try {
    const { name, description, material_image_id } = req.body;
    const [material] = await Material.create({ name, description, material_image_id });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a material
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, material_image_id } = req.body;
    const [material] = await Material.update(id, { name, description, material_image_id });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.delete(id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};