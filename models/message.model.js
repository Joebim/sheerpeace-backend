const { db } = require("../config/db");
const { v4: uuidv4 } = require('uuid');

const Message = {
  // Get all messages for a user
  getByUserId: (userId) =>
    db("messages").where({ user_id: userId }).select("*"),

  // Create a new message
  create: (data) =>
    db("messages")
      .insert({
        id: uuidv4(),
        ...data,
      })
      .returning("*"),

  // Mark a message as read
  markAsRead: (id) =>
    db("messages").where({ id }).update({ is_read: true }).returning("*"),

  // Delete a message
  delete: (id) => db("messages").where({ id }).del(),
};

module.exports = Message;
