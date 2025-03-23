const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Product.getAll(page, limit);

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch products: ${error.message}` });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch product ${error}` });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Create multiple products
const createMultiple = async (req, res) => {
  try {
    const newProducts = await Product.createMultiple(req.body);
    res.status(201).json(newProducts);
  } catch (error) {
    res.status(500).json({ error: `Failed to create products: ${error}` });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

const queryProducts = async (req, res) => {
  try {
    const filters = req.query;
    console.log("Received filters:", filters);

    const products = await Product.queryProducts(filters);
    res.json(products);
  } catch (error) {
    console.error("Error querying products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.updateViewCount(id);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Failed to update view count:", error);
    res.status(500).json({ error: "Failed to update product views" });
  }
};

const updateLikeCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { increment } = req.body; // Pass true to increase, false to decrease

    const updatedProduct = await Product.updateLikeCount(id, increment);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Failed to update like count:", error);
    res.status(500).json({ error: "Failed to update product likes" });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.toggleFeatured(id);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Failed to toggle isFeatured:", error);
    res.status(500).json({ error: "Failed to toggle product featured status" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const filters = req.query;
    const results = await Product.searchProducts(filters);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error searching products:", error);
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error: ${error}` });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  createMultiple,
  updateProduct,
  deleteProduct,
  queryProducts,
  updateViewCount,
  updateLikeCount,
  toggleFeatured,
  searchProducts,
};
