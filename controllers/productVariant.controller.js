const ProductVariant = require('../models/productVariant.model');

exports.getProductVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.getAllByProductId(req.params.product_id);
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProductVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.create({ ...req.body, product_id: req.params.product_id });
    res.status(201).json({ message: 'Variant added successfully', variant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.update(req.params.id, req.body);
    if (!variant) return res.status(404).json({ error: 'Variant not found' });
    res.json({ message: 'Variant updated successfully', variant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const deletedVariant = await ProductVariant.delete(req.params.id);
    if (!deletedVariant) return res.status(404).json({ error: 'Variant not found' });
    res.json({ message: 'Variant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
