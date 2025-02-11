const { db } = require('../config/db');

const ShippingOption = {
  // Get all shipping options
  getAll: () => db('shipping_options').select('*'),

  // Get a shipping option by ID
  getById: (id) => db('shipping_options').where({ id }).first(),

  // Create a new shipping option
  create: (data) => db('shipping_options').insert(data).returning('*'),

  // Update a shipping option
  update: (id, data) => db('shipping_options').where({ id }).update(data).returning('*'),

  // Delete a shipping option
  delete: (id) => db('shipping_options').where({ id }).del(),
};

module.exports = ShippingOption;