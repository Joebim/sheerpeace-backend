const Question = require("../models/question.models");

const questionController = {
  // Get all questions for a product
  getQuestionsForProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const questions = await Question.getByProductId(productId);
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create a new question
  createQuestion: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
      const { question } = req.body;

      if (!question) {
        return res
          .status(400)
          .json({ success: false, message: "Question is required" });
      }

      const newQuestion = await Question.create(productId, userId, question);
      res.status(201).json({ success: true, data: newQuestion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete a question
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      await Question.delete(id);
      res.json({ success: true, message: "Question deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = questionController;
