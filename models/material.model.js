const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Material = {
  // Get all materials
  getAll: async () => {
    const materials = await db("materials").select("*");
    const materialsWithUpload = await Promise.all(
      materials.map(async (material) => {
        const materialImage = material.material_image_id
          ? await db("uploads")
              .where({ id: material.material_image_id })
              .first()
          : null;

        return {
          ...material,
          material_image: materialImage ? materialImage.file : null,
        };
      })
    );
    return materialsWithUpload;
  },

  // Get a material by ID
  getById: async (id) => db("materials").where({ id }).first(),

  // Create a new material
  create: async (data) =>
    db("materials")
      .insert({
        id: uuidv4(),
        ...data,
      })
      .returning("*"),

  // Update a material
  update: async (id, data) =>
    db("materials").where({ id }).update(data).returning("*"),

  // Delete a material
  delete: async (id) => db("materials").where({ id }).del(),
};

module.exports = Material;
