const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Public route
router.get("/public", (req, res) => {
    res.json({ message: "This is a public route" });
});

// Protected route (any authenticated user can access)
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "You accessed a protected route!", user: req.user });
});

// Admin-only route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: "Admin access granted!" });
});

module.exports = router;
