const { db } = require('../config/db');

const ShippingAddress = {
  // Get all shipping addresses for a user
  getByUserId: (userId) => db('shipping_addresses').where({ user_id: userId }).select('*'),

  // Create a new shipping address
  create: (data) => db('shipping_addresses').insert(data).returning('*'),

  // Update a shipping address
  update: (id, data) => db('shipping_addresses').where({ id }).update(data).returning('*'),

  // Delete a shipping address
  delete: (id) => db('shipping_addresses').where({ id }).del(),
};

module.exports = ShippingAddress;