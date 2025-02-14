const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Brand = {
  // Get all brands with populated data
  getAll: async () => {
    const brands = await db('brands').select('*');
    const brandsWithDetails = await Promise.all(
      brands.map(async (brand) => {
        // Fetch logo and banner image from uploads table
        const logo = brand.logo
          ? await db('uploads').where({ id: brand.logo }).first()
          : null;
        const bannerImage = brand.bannerImage
          ? await db('uploads').where({ id: brand.bannerImage }).first()
          : null;

        // Fetch categories and featured products
        const categories = brand.categories
          ? await db('categories').whereIn('id', brand.categories).select('*')
          : [];
        const featuredProducts = brand.featuredProducts
          ? await db('products').whereIn('id', brand.featuredProducts).select('*')
          : [];

        return {
          ...brand,
          logo: logo ? logo.file : null,
          bannerImage: bannerImage ? bannerImage.file : null,
          categories,
          featuredProducts,
        };
      })
    );
    return brandsWithDetails;
  },

  // Get a brand by ID with populated data
  getById: async (id) => {
    const brand = await db('brands').where({ id }).first();
    if (!brand) return null;

    // Fetch logo and banner image from uploads table
    const logo = brand.logo
      ? await db('uploads').where({ id: brand.logo }).first()
      : null;
    const bannerImage = brand.bannerImage
      ? await db('uploads').where({ id: brand.bannerImage }).first()
      : null;

    // Fetch categories and featured products
    const categories = brand.categories
      ? await db('categories').whereIn('id', brand.categories).select('*')
      : [];
    const featuredProducts = brand.featuredProducts
      ? await db('products').whereIn('id', brand.featuredProducts).select('*')
      : [];

    return {
      ...brand,
      logo: logo ? logo.file : null,
      bannerImage: bannerImage ? bannerImage.file : null,
      categories,
      featuredProducts,
    };
  },

  // Create a new brand
  create: (data) => db('brands').insert(data).returning('*'),

  // Create multiple brands
  createMultiple: (data) => {
    const brandsWithIds = data.map((brand) => ({
      id: uuidv4(), // Generate a UUID for each brand
      name: brand.name,
      slug: brand.slug,
      description: brand.description || null,
      logo: brand.logo || null,
      bannerImage: brand.bannerImage || null,
      establishedYear: brand.establishedYear || null,
      headquarters: brand.headquarters || null,
      website: brand.website || null,
      contactEmail: brand.contactEmail || null,
      socialLinks: brand.socialLinks ? JSON.stringify(brand.socialLinks) : null, // Serialize JSON
      categories: brand.categories ? JSON.stringify(brand.categories) : null, // Serialize JSON
      featuredProducts: brand.featuredProducts ? JSON.stringify(brand.featuredProducts) : null, // Serialize JSON
      totalProducts: brand.totalProducts || 0,
      averageRating: brand.averageRating || 0,
      totalReviews: brand.totalReviews || 0,
      missionStatement: brand.missionStatement || null,
      values: brand.values ? JSON.stringify(brand.values) : null, // Serialize JSON
      isActive: brand.isActive !== undefined ? brand.isActive : true,
    }));
    return db('brands').insert(brandsWithIds).returning('*');
  },

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