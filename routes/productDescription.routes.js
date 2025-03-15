// routes/productDetailsRoutes.js
const express = require("express");
const router = express.Router();
const ProductDescriptionController = require("../controllers/productDescription.controller");

// Description routes
router.post("/", ProductDescriptionController.createDescription);
router.get("/:productId", ProductDescriptionController.getProductDescription);

module.exports = router;