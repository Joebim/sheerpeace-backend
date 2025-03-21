const express = require("express");
const {
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
} = require("../controllers/product.controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/query", queryProducts);
router.get("/search", searchProducts);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.post("/multiple", authMiddleware, adminMiddleware, createMultiple);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("id", authMiddleware, adminMiddleware, deleteProduct);
router.patch("/:id/views", updateViewCount);
router.patch("/:id/likes", updateLikeCount);
router.patch("/:id/featured", toggleFeatured);

module.exports = router;
