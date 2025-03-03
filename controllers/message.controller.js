const Message = require("../models/message.model");

// Get all messages for a user
exports.getAllMessages = async (req, res) => {
  const userId = req.user.id;
  try {
    const messages = await Message.getByUserId(userId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new message
exports.createMessage = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  console.log(userId, data);
  try {
    const newMessage = await Message.create({
      user_id: userId,
      ...data,
    });
    res.status(201).json(newMessage[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a message as read
exports.markMessageAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMessage = await Message.markAsRead(id);
    if (updatedMessage.length > 0) {
      res.json(updatedMessage[0]);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await Message.delete(id);
    if (deletedCount > 0) {
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
