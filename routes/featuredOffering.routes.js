const express = require("express");
const {
  getAllFeatured,
  getFeaturedById,
  createFeatured,
  updateFeatured,
  deleteFeatured,
  queryFeatured,
} = require("../controllers/featuredOffering.controller");

const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllFeatured);
router.get("/:id", getFeaturedById);
router.get("/query", queryFeatured);
router.post("/", authMiddleware, adminMiddleware, createFeatured);
router.put("/:id", authMiddleware, adminMiddleware, updateFeatured);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFeatured);

module.exports = router;
