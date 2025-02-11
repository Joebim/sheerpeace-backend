const { db } = require('../config/db');

const Message = {
  // Get all messages for a user
  getByUserId: (userId) => db('messages').where({ user_id: userId }).select('*'),

  // Create a new message
  create: (data) => db('messages').insert(data).returning('*'),

  // Mark a message as read
  markAsRead: (id) => db('messages').where({ id }).update({ is_read: true }).returning('*'),

  // Delete a message
  delete: (id) => db('messages').where({ id }).del(),
};

module.exports = Message;