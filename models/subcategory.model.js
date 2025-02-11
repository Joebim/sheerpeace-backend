const { db } = require('../config/db');

const Subcategory = {
  // Get all subcategories
  getAll: () => db('subcategories').select('*'),

  // Get a subcategory by ID
  getById: (id) => db('subcategories').where({ id }).first(),

  // Create a new subcategory
  create: (data) => db('subcategories').insert(data).returning('*'),

  // Update a subcategory
  update: (id, data) => db('subcategories').where({ id }).update(data).returning('*'),

  // Delete a subcategory
  delete: (id) => db('subcategories').where({ id }).del(),
};

module.exports = Subcategory;