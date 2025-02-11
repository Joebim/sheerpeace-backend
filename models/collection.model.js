const { db } = require('../config/db');

const Collection = {
  // Get all collections
  getAll: () => db('collections').select('*'),

  // Get a collection by ID
  getById: (id) => db('collections').where({ id }).first(),

  // Create a new collection
  create: (data) => db('collections').insert(data).returning('*'),

  // Update a collection
  update: (id, data) => db('collections').where({ id }).update(data).returning('*'),

  // Delete a collection
  delete: (id) => db('collections').where({ id }).del(),
};

module.exports = Collection;