const { db } = require('../config/db');

const Size = {
  getAll: () => db('sizes').select('*'), // Get all sizes
  getById: (id) => db('sizes').where({ id }).first(), // Get a specific size by ID
  create: (data) => db('sizes').insert(data).returning('*'), // Create a new size
  update: (id, data) => db('sizes').where({ id }).update(data).returning('*'), // Update an existing size
  delete: (id) => db('sizes').where({ id }).del(), // Delete a size
};

module.exports = Size;
