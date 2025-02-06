const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.user_type !== "admin") {
        return res.status(403).json({ message: "Access restricted to admins only" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
