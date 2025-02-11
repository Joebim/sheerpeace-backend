const { db } = require('../config/db');

const Cart = {
  // Get cart by user ID
  getByUserId: (userId) => db('carts').where({ user_id: userId }).first(),

  // Create a new cart
  create: (data) => db('carts').insert(data).returning('*'),

  // Add item to cart
  addItem: (data) => db('cart_items').insert(data).returning('*'),

  // Update cart item quantity
  updateItemQuantity: (cartItemId, quantity) =>
    db('cart_items').where({ id: cartItemId }).update({ quantity }).returning('*'),

  // Remove item from cart
  removeItem: (cartItemId) => db('cart_items').where({ id: cartItemId }).del(),

  // Get cart items by cart ID
  getItems: (cartId) => db('cart_items').where({ cart_id: cartId }).select('*'),
};

module.exports = Cart;