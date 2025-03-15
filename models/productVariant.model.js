const { db } = require("../config/db");

const ProductVariant = {
  getAllByProductId: async (productId) => {
    const variants = await db("product_variants")
      .select("product_variants.*", "uploads.file as image")
      .leftJoin("uploads", "product_variants.image_id", "uploads.id")
      .where("product_variants.product_id", productId);

    if (variants.length === 0) {
      return [];
    }

    return Promise.all(
      variants.map(async (variant) => {
        // Fetch full color object (if color ID exists)
        const color = variant.color
          ? await db("colors").where({ id: variant.color }).first()
          : null;

        // Fetch full image object (if image_id exists)
        const image = variant.image_id
          ? await db("uploads").where({ id: variant.image_id }).first()
          : null;

        // Fetch all materials linked to this variant
        const materials = variant.material_ids
          ? await db("materials")
              .whereIn("id", variant.material_ids)
              .select("*")
          : [];

        return {
          ...variant,
          color, // Now contains full color object
          image: image ? image.file : null,
          materials,
        };
      })
    );
  },

  create: async (data) => {
    const [variant] = await db("product_variants").insert(data).returning("*");
    return variant;
  },

  update: async (variantId, data) => {
    const [variant] = await db("product_variants")
      .where({ id: variantId })
      .update(data)
      .returning("*");
    return variant;
  },

  delete: async (variantId) => {
    const deleted = await db("product_variants")
      .where({ id: variantId })
      .del()
      .returning("*");
    return deleted;
  },
};

module.exports = ProductVariant;
