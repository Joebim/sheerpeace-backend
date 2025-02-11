const { db } = require('../config/db');
const ProductVariant = require('./productVariant.model');

const Product = {
  getAll: async (filters) => {
    let query = db('products')
      .select(
        'products.*',
        'categories.name as category',
        'subcategories.name as subCategory',
        'brands.name as brand',
        'collections.name as collection',
        db.raw('json_agg(DISTINCT jsonb_build_object(\'name\', colors.name, \'hex\', colors.hex)) AS colors'),
        db.raw('json_agg(DISTINCT sizes.name) AS sizes'),
        db.raw('json_agg(DISTINCT materials.name) AS materials'),
        db.raw('json_agg(DISTINCT shipping_options.name) AS shippingOptions'),
        db.raw('json_agg(DISTINCT uploads.url) AS images')
      )
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .leftJoin('subcategories', 'products.sub_category_id', 'subcategories.id')
      .leftJoin('brands', 'products.brand_id', 'brands.id')
      .leftJoin('collections', 'products.collection_id', 'collections.id')
      .leftJoin('product_colors', 'products.id', 'product_colors.product_id')
      .leftJoin('colors', 'product_colors.color_id', 'colors.id')
      .leftJoin('product_sizes', 'products.id', 'product_sizes.product_id')
      .leftJoin('sizes', 'product_sizes.size_id', 'sizes.id')
      .leftJoin('product_materials', 'products.id', 'product_materials.product_id')
      .leftJoin('materials', 'product_materials.material_id', 'materials.id')
      .leftJoin('product_shipping_options', 'products.id', 'product_shipping_options.product_id')
      .leftJoin('shipping_options', 'product_shipping_options.shipping_option_id', 'shipping_options.id')
      .leftJoin('product_images', 'products.id', 'product_images.product_id')
      .leftJoin('uploads', 'product_images.upload_id', 'uploads.id')
      .groupBy('products.id', 'categories.name', 'subcategories.name', 'brands.name', 'collections.name');

    if (filters.category_id) query.where('products.category_id', filters.category_id);
    if (filters.brand_id) query.where('products.brand_id', filters.brand_id);
    if (filters.size_id) query.where('product_sizes.size_id', filters.size_id);
    if (filters.color_id) query.where('product_colors.color_id', filters.color_id);

    const products = await query;

    // Fetch variants for each product
    for (let product of products) {
      product.variants = await ProductVariant.getAllByProductId(product.id);
    }

    return products;
  },

  getById: async (id) => {
    const product = await db('products')
      .select('*')
      .where({ id })
      .first();

    if (product) {
      product.variants = await ProductVariant.getAllByProductId(id);
    }

    return product;
  },

  create: async (data) => {
    const [product] = await db('products').insert(data).returning('*');
    return product;
  },

  update: async (id, data) => {
    const [product] = await db('products').where({ id }).update(data).returning('*');
    return product;
  },

  delete: async (id) => {
    const deleted = await db('products').where({ id }).del().returning('*');
    return deleted;
  },
};

module.exports = Product;
