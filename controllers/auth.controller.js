const { db } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getUserByEmail = async (email) => {
    return db("users").where({ email }).first();
};

const register = async (req, res) => {
    try {
        const { name, email, password, user_type } = req.body;

        // Check if user exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Prevent normal users from signing up as admin
        const role = user_type === "admin" ? "user" : user_type;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const [newUser] = await db("users")
            .insert({
                name,
                email,
                password: hashedPassword,
                user_type: role,
            })
            .returning(["id", "name", "email", "user_type", "created_at"]);

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user existence
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, user_type: user.user_type } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { register, login };
