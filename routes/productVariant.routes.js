const express = require("express");
const {
  getProductVariants,
  addProductVariant,
  deleteVariant,
  updateVariant,
} = require("../controllers/productVariant.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:product_id", getProductVariants);
router.post("/:product_id", authMiddleware, addProductVariant);
router.put("/:id", authMiddleware, updateVariant);
router.delete("/:id", authMiddleware, deleteVariant);

module.exports = router;
