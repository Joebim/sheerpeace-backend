const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Answer = {
  // Get all answers for a question
  getByQuestionId: async (questionId) => {
    return await db("product_answers")
      .where({ question_id: questionId })
      .select("*");
  },

  // Create an answer
  create: async (questionId, user_id, answer, isAdmin) => {
    const newAnswer = {
      id: uuidv4(),
      question_id: questionId,
      user_id: user_id || null,
      answer,
      is_admin_answer: isAdmin,
    };
    return await db("product_answers").insert(newAnswer).returning("*");
  },

  // Delete an answer
  delete: async (id) => {
    return await db("product_answers").where({ id }).del();
  },
};

module.exports = Answer;
