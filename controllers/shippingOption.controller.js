const ShippingOption = require('../models/shippingOption.model');

// Get all shipping options
exports.getAllShippingOptions = async (req, res) => {
  try {
    const shippingOptions = await ShippingOption.getAll();
    res.json(shippingOptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a shipping option by ID
exports.getShippingOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const shippingOption = await ShippingOption.getById(id);
    if (!shippingOption) return res.status(404).json({ error: 'Shipping option not found' });
    res.json(shippingOption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new shipping option
exports.createShippingOption = async (req, res) => {
  try {
    const { name, price, delivery_time, description } = req.body;
    const [shippingOption] = await ShippingOption.create({ name, price, delivery_time, description });
    res.status(201).json(shippingOption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a shipping option
exports.updateShippingOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, delivery_time, description } = req.body;
    const [shippingOption] = await ShippingOption.update(id, { name, price, delivery_time, description });
    if (!shippingOption) return res.status(404).json({ error: 'Shipping option not found' });
    res.json(shippingOption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a shipping option
exports.deleteShippingOption = async (req, res) => {
  try {
    const { id } = req.params;
    const shippingOption = await ShippingOption.delete(id);
    if (!shippingOption) return res.status(404).json({ error: 'Shipping option not found' });
    res.json({ message: 'Shipping option deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};