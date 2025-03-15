const Answer = require("../models/answer.model");

const answerController = {
  // Get all answers for a question
  getAnswersForQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      const answers = await Answer.getByQuestionId(questionId);
      res.json({ success: true, data: answers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Create an answer
  createAnswer: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { questionId } = req.params;
      const { answer } = req.body;

      let isAdmin;

      if (req.user?.user_type === "admin") {
        isAdmin = true;
      } else {
        isAdmin = false;
      }

      if (!answer) {
        return res
          .status(400)
          .json({ success: false, message: "Answer is required" });
      }

      const newAnswer = await Answer.create(
        questionId,
        user_id,
        answer,
        isAdmin
      );
      res.status(201).json({ success: true, data: newAnswer });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete an answer
  deleteAnswer: async (req, res) => {
    try {
      const { id } = req.params;
      await Answer.delete(id);
      res.json({ success: true, message: "Answer deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = answerController;
