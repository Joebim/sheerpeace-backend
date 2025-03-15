// routes/productDetailsRoutes.js
const express = require("express");
const router = express.Router();
const ProductSpecificationController = require("../controllers/productSpecification.controller");

// Specification routes
router.post("/", ProductSpecificationController.createSpecification);
router.get("/:productId", ProductSpecificationController.getProductSpecifications);

module.exports = router;