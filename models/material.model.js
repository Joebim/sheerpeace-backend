const { db } = require('../config/db');

const Material = {
  // Get all materials
  getAll: () => db('materials').select('*'),

  // Get a material by ID
  getById: (id) => db('materials').where({ id }).first(),

  // Create a new material
  create: (data) => db('materials').insert(data).returning('*'),

  // Update a material
  update: (id, data) => db('materials').where({ id }).update(data).returning('*'),

  // Delete a material
  delete: (id) => db('materials').where({ id }).del(),
};

module.exports = Material;