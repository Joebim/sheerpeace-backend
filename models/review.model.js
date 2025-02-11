const { db } = require('../config/db');

const Review = {
  getByProduct: (product_id) => db('reviews').where({ product_id }).select('*'),
  create: (user_id, product_id, rating, comment) => 
    db('reviews').insert({ user_id, product_id, rating, comment }).returning('*'),
  update: (review_id, user_id, data) => 
    db('reviews').where({ id: review_id, user_id }).update(data).returning('*'),
  delete: (review_id, user_id) => 
    db('reviews').where({ id: review_id, user_id }).del().returning('*'),
};

module.exports = Review;
