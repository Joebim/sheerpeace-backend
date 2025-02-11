const { db } = require('../config/db');

const Wishlist = {
  getUserWishlist: (user_id) => db('wishlist').where({ user_id }).select('*'),
  addProduct: (user_id, product_id) => 
    db('wishlist').insert({ user_id, product_id }).returning('*'),
  removeProduct: (user_id, product_id) => 
    db('wishlist').where({ user_id, product_id }).del().returning('*'),
};

module.exports = Wishlist;
