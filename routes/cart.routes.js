const express = require("express");
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  deleteCart,
  synchronizeCart,
  editCartItem,
} = require("../controllers/cart.controller");

const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");

// Cart routes
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addItem);
router.post("/sync", authMiddleware, synchronizeCart);
router.put("/update/:cartItemId", authMiddleware, updateItemQuantity);
router.delete("/remove/:cartItemId", authMiddleware, removeItem);
router.delete("/:id", authMiddleware, deleteCart);
router.put("/edit/:cartItemId", authMiddleware, editCartItem);

module.exports = router;
