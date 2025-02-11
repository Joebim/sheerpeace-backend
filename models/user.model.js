const { db } = require("../config/db");

// Get user by email
const getUserByEmail = async (email) => {
    return db('users').where({ email }).first();
  };
  
  // Get user by ID
  const getUserById = async (id) => {
    return db('users').where({ id }).first();
  };
  
  // Update user by ID
  const updateUser = async (id, data) => {
    const [updatedUser] = await db('users').where({ id }).update(data).returning('*');
    return updatedUser;
  };
  
  // Delete user by ID
  const deleteUser = async (id) => {
    return db('users').where({ id }).del();
  };
  
  module.exports = { getUserByEmail, getUserById, updateUser, deleteUser };
