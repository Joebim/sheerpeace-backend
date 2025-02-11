const { db } = require('../config/db');

const Category = {
  // Get all categories
  getAll: () => db('categories').select('*'),

  // Get a category by ID
  getById: (id) => db('categories').where({ id }).first(),

  // Create a new category
  create: (data) => db('categories').insert(data).returning('*'),

  // Update a category
  update: (id, data) => db('categories').where({ id }).update(data).returning('*'),

  // Delete a category
  delete: (id) => db('categories').where({ id }).del(),

  // Get category image details from uploads table
  getCategoryImage: async (categoryId) => {
    const category = await db('categories').where({ id: categoryId }).first();
    if (!category || !category.image) return null;

    const image = await db('uploads').where({ id: category.image }).first();
    return image ? image.file : null;
  },
};

module.exports = Category;