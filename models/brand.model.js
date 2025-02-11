const { db } = require('../config/db');

const Brand = {
  // Get all brands
  getAll: () => db('brands').select('*'),

  // Get a brand by ID
  getById: (id) => db('brands').where({ id }).first(),

  // Create a new brand
  create: (data) => db('brands').insert(data).returning('*'),

  // Update a brand
  update: (id, data) => db('brands').where({ id }).update(data).returning('*'),

  // Delete a brand
  delete: (id) => db('brands').where({ id }).del(),

  // Get brand logo and banner image details from uploads table
  getBrandImages: async (brandId) => {
    const brand = await db('brands').where({ id: brandId }).first();
    if (!brand) return null;

    const logo = await db('uploads').where({ id: brand.logo }).first();
    const bannerImage = brand.bannerImage
      ? await db('uploads').where({ id: brand.bannerImage }).first()
      : null;

    return {
      logo: logo ? logo.file : null,
      bannerImage: bannerImage ? bannerImage.file : null,
    };
  },

  // Get featured products details
  getFeaturedProducts: async (brandId) => {
    const brand = await db('brands').where({ id: brandId }).first();
    if (!brand || !brand.featuredProducts) return [];

    const products = await db('products')
      .whereIn('id', brand.featuredProducts)
      .select('*');

    return products;
  },

  // Get categories details
  getCategories: async (brandId) => {
    const brand = await db('brands').where({ id: brandId }).first();
    if (!brand || !brand.categories) return [];

    const categories = await db('categories')
      .whereIn('id', brand.categories)
      .select('*');

    return categories;
  },
};

module.exports = Brand;