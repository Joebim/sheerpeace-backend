// controllers/ProductSpecificationController.js
const {
  addSpecification,
  getSpecificationsByProduct,
} = require("../models/productSpecification.model");

const ProductSpecificationController = {
  createSpecification: async (req, res) => {
    try {
      const { product_id, specifications } = req.body;
      const specification = await addSpecification(product_id, specifications);
      res.status(201).json(specification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductSpecifications: async (req, res) => {
    try {
      const { product_id } = req.params;
      const specifications = await getSpecificationsByProduct(product_id);
      res.json(specifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductSpecificationController;
