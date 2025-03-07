const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");
const {
  getAllUsers,
  getLoggedInUser,
  getUser,
  updateUserDetails,
  deleteUserById,
} = require("../controllers/user.controller");
const router = express.Router();

// Protected route: Get logged-in user details
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

router.get("/me", authMiddleware, getLoggedInUser);

// Protected route: Get a user by ID
router.get("/:id", authMiddleware, getUser);

// Protected route: Update user details
router.put("/:id", authMiddleware, updateUserDetails);

// Admin-only route: Delete a user by ID
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserById);

module.exports = router;
