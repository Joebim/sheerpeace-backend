const express = require('express');
const {
  getAllMessages,
  createMessage,
  markMessageAsRead,
  deleteMessage,
} = require('../controllers/message.controller');
const router = express.Router();

// Get all messages for a user
router.get('/:userId', getAllMessages);

// Create a new message
router.post('/', createMessage);

// Mark a message as read
router.put('/:id/mark-as-read', markMessageAsRead);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;
