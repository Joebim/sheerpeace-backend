const express = require('express');
const {
  getAllMessages,
  createMessage,
  markMessageAsRead,
  deleteMessage,
} = require('../controllers/message.controller');
const router = express.Router();
const {
  authMiddleware,
} = require("../middleware/auth.middleware");

// Get all messages for a user
router.get('/', authMiddleware, getAllMessages);

// Create a new message
router.post('/', authMiddleware, createMessage);

// Mark a message as read
router.put('/:id/mark-as-read', authMiddleware, markMessageAsRead);

// Delete a message
router.delete('/:id',authMiddleware,  deleteMessage);

module.exports = router;
