const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

// Get all questions for a product
router.get(
  "/:productId",
  authMiddleware,
  adminMiddleware,
  questionController.getQuestionsForProduct
);

// Create a new question for a product
router.post(
  "/:productId",
  authMiddleware,
  adminMiddleware,
  questionController.createQuestion
);

// Delete a question
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  questionController.deleteQuestion
);

module.exports = router;
