const { db } = require("../config/db");

const { getUserById, updateUser, deleteUser } = require('../models/user.model');

// Get the logged-in user
const getLoggedInUser = async (req, res) => {
  try {
      const user = await db("users")
          .where({ id: req.user.id })
          .first()
          .select("id", "name", "email", "user_type", "created_at", "updated_at");

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a user by ID
const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a user by ID
const updateUserDetails = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await deleteUser(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLoggedInUser,
  getUser,
  updateUserDetails,
  deleteUserById,
};
