const express = require("express");
const {
  getCart,
  addItem,
  addItems,
  updateItemQuantity,
  removeItem,
  deleteCart,
  synchronizeCart,
  editCartItem,
} = require("../controllers/cart.controller");

const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addItem);
router.post("/add-multiple", authMiddleware, addItems);
router.post("/sync", authMiddleware, synchronizeCart);
router.put("/update/:productId", authMiddleware, updateItemQuantity); 
router.delete("/remove/:productId", authMiddleware, removeItem); 
router.delete("/:id", authMiddleware, deleteCart);
router.put("/edit/:cartItemId", authMiddleware, editCartItem);

module.exports = router;