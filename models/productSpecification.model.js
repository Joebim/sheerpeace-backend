// models/ProductSpecification.js

const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ProductSpecification = {
  addSpecification: async (product_id, specifications) => {
    const newSpecification = {
      id: uuidv4(),
      product_id: product_id,
      specifications,
    };
    return await db("product_specifications")
      .insert(newSpecification)
      .returning("*");
  },

  getSpecificationsByProduct: async (product_id) => {
    return await db("product_specifications")
      .where({ product_id: product_id })
      .first();
  },
};

module.exports = ProductSpecification;
