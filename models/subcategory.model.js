const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Subcategory = {
  getAll: async () => {
    const subcategories = await db('subcategories').select('*');
    const subcategoriesWithImages = await Promise.all(
      subcategories.map(async (subcategory) => {
        const image = subcategory.image
          ? await db('uploads').where({ id: subcategory.image }).first()
          : null;
        return {
          ...subcategory,
          image: image ? image.file : null, // Construct the image URL
        };
      })
    );
    return subcategoriesWithImages;
  },

  // Get a category by ID with image URL
  getById: async (id) => {
    const subcategory = await db('subcategories').where({ id }).first();
    if (!subcategory) return null;

    const image = subcategory.image
      ? await db('uploads').where({ id: subcategory.image }).first()
      : null;

    return {
      ...subcategory,
      image: image ? image.file : null, // Construct the image URL
    };
  },

  // Create a new subcategory
  create: (data) => db('subcategories').insert(data).returning('*'),
  createMultiple: (data) => {
    const subcategoriesWithIds = data.map(subcategory => ({
      id: uuidv4(),
      name: subcategory.name,
      image: subcategory.image || null,
      category_id: subcategory.category_id
    }));
    return db('subcategories').insert(subcategoriesWithIds).returning('*');
  },
  // Update a subcategory
  update: (id, data) => db('subcategories').where({ id }).update(data).returning('*'),

  // Delete a subcategory
  delete: (id) => db('subcategories').where({ id }).del(),
};

module.exports = Subcategory;