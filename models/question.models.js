const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Question = {
  // Get all questions for a product
  getByProductId: async (productId) => {
    return await db("product_questions").where({ product_id: productId }).select("*");
  },

  // Get a single question
  getById: async (id) => {
    return await db("product_questions").where({ id }).first();
  },

  // Create a question
  create: async (productId, userId, question) => {
    const newQuestion = {
      id: uuidv4(),
      product_id: productId,
      user_id: userId || null,
      question,
    };
    return await db("product_questions").insert(newQuestion).returning("*");
  },

  // Delete a question
  delete: async (id) => {
    return await db("product_questions").where({ id }).del();
  },
};

module.exports = Question;
