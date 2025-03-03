const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeaturedOffering = {
  getAll: async () => {
    const featuredOffering = await db("featured_offerings").select("*");
    const featuredOfferingWithLogo = await Promise.all(
      featuredOffering.map(async (offering) => {
        const image = offering.image_url
          ? await db("uploads").where({ id: offering.image_url }).first()
          : null;

        return {
          ...offering,
          image_url: image ? image.file : null,
        };
      })
    );
    return featuredOfferingWithLogo;
  },

  getById: async (id) => {
    const featuredOffering = await db("featured_offerings")
      .where({ id })
      .first();
    if (!featuredOffering) return null;

    const image = featuredOffering.image_url
      ? await db("uploads").where({ id: featuredOffering.image_url }).first()
      : null;

    return {
      ...featuredOffering,
      image_url: image ? image.file : null,
    };
  },

  create: async (data) => {
    const newEntry = {
      id: uuidv4(),
      ...data,
      category_id: data.category_id || null,
      subcategory_id: data.subcategory_id || null,
    };
    const insertedEntry = await db("featured_offerings")
      .insert(newEntry)
      .returning("*");
    return insertedEntry[0];
  },

  update: async (id, data) => {
    return await db("featured_offerings")
      .where({ id })
      .update(data)
      .returning("*");
  },

  delete: async (id) => {
    return await db("featured_offerings").where({ id }).del();
  },

  queryFeatured: async (filters) => {
    let query = db("featured_offerings");  // Base query

    // Apply filters only if they exist
    if (filters.is_featured !== undefined) query = query.where("is_featured", filters.is_featured);
    if (filters.trending !== undefined) query = query.where("trending", filters.trending);
    if (filters.is_new !== undefined) query = query.where("is_new", filters.is_new);
    if (filters.top_selling !== undefined) query = query.where("top_selling", filters.top_selling);
    if (filters.top_choice !== undefined) query = query.where("top_choice", filters.top_choice);
    if (filters.rating !== undefined) query = query.where("rating", ">=", filters.rating);
    if (filters.category !== undefined) query = query.where("category_id", filters.category);
    if (filters.subcategory !== undefined) query = query.where("subcategory_id", filters.subcategory);
    if (filters.discount !== undefined) query = query.where("is_discounted", filters.discount);

    console.log("Generated SQL:", query.toString());  // Debugging: Log SQL query

    return await query.select("*");
}
};

module.exports = FeaturedOffering;
