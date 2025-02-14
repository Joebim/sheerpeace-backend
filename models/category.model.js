const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Category = {
  getAll: async () => {
    const categories = await db('categories').select('*');
    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        const image = category.image
          ? await db('uploads').where({ id: category.image }).first()
          : null;
        return {
          ...category,
          image: image ? image.file : null, // Construct the image URL
        };
      })
    );
    return categoriesWithImages;
  },

  // Get a category by ID with image URL
  getById: async (id) => {
    const category = await db('categories').where({ id }).first();
    if (!category) return null;

    const image = category.image
      ? await db('uploads').where({ id: category.image }).first()
      : null;

    return {
      ...category,
      image: image ? image.file : null, // Construct the image URL
    };
  },

  // Create a new category
  create: (data) => db("categories").insert(data).returning("*"),
  createMultiple: (data) => {
    const categoriesWithIds = data.map((category) => ({
      id: uuidv4(),
      name: category.name,
      image: category.image || null,
    }));
    return db("categories").insert(categoriesWithIds).returning("*");
  },

  // Update a category
  update: (id, data) =>
    db("categories").where({ id }).update(data).returning("*"),

  // Delete a category
  delete: (id) => db("categories").where({ id }).del(),

  // Get category image details from uploads table
  getCategoryImage: async (categoryId) => {
    const category = await db("categories").where({ id: categoryId }).first();
    if (!category || !category.image) return null;

    const image = await db("uploads").where({ id: category.image }).first();
    return image ? image.file : null;
  },
};

module.exports = Category;
