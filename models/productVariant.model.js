const { db } = require('../config/db');

const ProductVariant = {
  getAllByProductId: (productId) => {
    return db('variants')
      .select(
        'variants.*',
        'colors.name as color',
        'colors.hex as colorHex',
        'sizes.name as size',
        'uploads.url as image'
      )
      .leftJoin('colors', 'variants.color_id', 'colors.id')
      .leftJoin('sizes', 'variants.size_id', 'sizes.id')
      .leftJoin('uploads', 'variants.image_id', 'uploads.id')
      .where('variants.product_id', productId);
  },

  getById: (variantId) => {
    return db('variants')
      .select(
        'variants.*',
        'colors.name as color',
        'colors.hex as colorHex',
        'sizes.name as size',
        'uploads.url as image'
      )
      .leftJoin('colors', 'variants.color_id', 'colors.id')
      .leftJoin('sizes', 'variants.size_id', 'sizes.id')
      .leftJoin('uploads', 'variants.image_id', 'uploads.id')
      .where('variants.id', variantId)
      .first();
  },

  create: async (data) => {
    const [variant] = await db('variants').insert(data).returning('*');
    return variant;
  },

  update: async (variantId, data) => {
    const [variant] = await db('variants').where({ id: variantId }).update(data).returning('*');
    return variant;
  },

  delete: async (variantId) => {
    const deleted = await db('variants').where({ id: variantId }).del().returning('*');
    return deleted;
  },
};

module.exports = ProductVariant;
