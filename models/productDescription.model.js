// models/ProductDescription.js
const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ProductDescription = {
  addDescription: async (product_id, description_html) => {
    const newDescription = {
      id: uuidv4(),
      product_id: product_id,
      description_html: description_html,
    };
    return await db("product_descriptions")
      .insert(newDescription)
      .returning("*");
  },

  getDescriptionByProduct: async (product_id) => {
    return await db("product_descriptions")
      .where({ product_id: product_id })
      .first();
  },
};

module.exports = ProductDescription;
