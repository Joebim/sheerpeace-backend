const { db } = require('../config/db');

const Order = {
  // Create a new order
  create: (data) => db('orders').insert(data).returning('*'),

  // Get order by ID
  getById: (id) => db('orders').where({ id }).first(),

  // Get all orders for a user
  getByUserId: (userId) => db('orders').where({ user_id: userId }).select('*'),

  // Add item to order
  addItem: (data) => db('order_items').insert(data).returning('*'),

  // Get order items by order ID
  getItems: (orderId) => db('order_items').where({ order_id: orderId }).select('*'),

  // Create a payment
  createPayment: (data) => db('payments').insert(data).returning('*'),
};

module.exports = Order;