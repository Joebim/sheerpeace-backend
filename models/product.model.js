const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Product = {
  // Get all products with populated details
  getAll: async () => {
    const products = await db('products').select('*');
    return await Promise.all(
      products.map(async (product) => {
        const brand = await db('brands').where({ id: product.brand_id }).first();
        const categories = await db('categories').whereIn('id', product.category_ids).select('*');
        const subcategories = await db('subcategories').whereIn('id', product.subcategory_ids).select('*');
        const sizes = await db('sizes').whereIn('id', product.size_ids).select('*');
        const colors = await db('colors').whereIn('id', product.color_ids).select('*');
        const variants = product.variant_ids && product.variant_ids.length
        ? await db('product_variants').whereIn('id', JSON.parse(product.variant_ids)).select('*')
        : [];
        const images = await db('uploads').whereIn('id', product.images).select('*');
        
        return {
          ...product,
          brand,
          categories,
          subcategories,
          sizes,
          colors,
          variants,
          images: images.map(img => img.file),
        };
      })
    );
  },

  // Get product by ID with populated details
  getById: async (id) => {
    const product = await db('products').where({ id }).first();
    if (!product) return null;
    
    const brand = await db('brands').where({ id: product.brand_id }).first();
    const categories = await db('categories').whereIn('id', product.category_ids).select('*');
    const subcategories = await db('subcategories').whereIn('id', product.subcategory_ids).select('*');
    const sizes = await db('sizes').whereIn('id', product.size_ids).select('*');
    const colors = await db('colors').whereIn('id', product.color_ids).select('*');
    const variants = await db('variant_ids').whereIn('id', product.variant_ids).select('*');
    const images = await db('uploads').whereIn('id', product.images).select('*');
    
    return {
      ...product,
      brand,
      categories,
      subcategories,
      sizes,
      colors,
      variants,
      images: images.map(img => img.file),
    };
  },

  // Create a new product
  create: async (data) => {
    const newProduct = { id: uuidv4(), ...data };
    const insertedProduct = await db('products').insert(newProduct).returning('*');
    return insertedProduct[0];
  },

  // Create multiple products
  createMultiple: async (products) => {
    const productsWithIds = products.map(product => ({ id: uuidv4(), ...product }));
    return await db('products').insert(productsWithIds).returning('*');
  },

  // Update product
  update: async (id, data) => {
    return await db('products').where({ id }).update(data).returning('*');
  },

  // Delete product
  delete: async (id) => {
    return await db('products').where({ id }).del();
  }
};

module.exports = Product;
