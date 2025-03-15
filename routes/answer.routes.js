const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answer.controller");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

// Get all answers for a question
router.get(
  "/:questionId",
  authMiddleware,
  adminMiddleware,
  answerController.getAnswersForQuestion
);

// Create an answer to a question
router.post(
  "/:questionId",
  authMiddleware,
  adminMiddleware,
  answerController.createAnswer
);

// Delete an answer
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  answerController.deleteAnswer
);

module.exports = router;
