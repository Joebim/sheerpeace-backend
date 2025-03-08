const { db } = require("../config/db");

const ProductVariant = {
  getAllByProductId: async (productId) => {
    const variants = await db("product_variants")
      .select(
        "product_variants.*",
        "colors.name as color",
        "colors.hex as colorHex",
        "uploads.file as image"
      )
      .leftJoin("colors", "product_variants.color", "colors.id")
      .leftJoin("uploads", "product_variants.image_id", "uploads.id")
      .where("product_variants.product_id", productId);

    if (variants.length === 0) {
      return [];
    }

    return Promise.all(
      variants.map(async (variant) => {
        const color = variant.color
          ? await db("colors").where({ id: variant.color }).first()
          : null;
        const image = variant.image_id
          ? await db("uploads").where({ id: variant.image_id }).first()
          : null;

        return {
          ...variant,
          color: color ? color.name : null,
          colorHex: color ? color.hex : null,
          image: image ? image.file : null,
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
