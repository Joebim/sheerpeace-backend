// controllers/ProductDescriptionController.js
const {
  addDescription,
  getDescriptionByProduct,
} = require("../models/productDescription.model");

const ProductDescriptionController = {
  createDescription: async (req, res) => {
    try {
      const { product_id, description_html } = req.body;
      const description = await addDescription(product_id, description_html);
      res.status(201).json(description);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductDescription: async (req, res) => {
    try {
      const { product_id } = req.params;
      const description = await getDescriptionByProduct(product_id);
      res.json(description);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductDescriptionController;
