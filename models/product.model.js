const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

const Product = {
  // Get all products with populated details
  getAll: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // Fetch total count of products
    const [{ count }] = await db("products").count("id as count");

    // Fetch paginated products
    const products = await db("products")
      .select("*")
      .limit(limit)
      .offset(offset);

    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        let brand = null;
        if (product.brand_id) {
          brand = await db("brands").where({ id: product.brand_id }).first();
          if (brand) {
            const [logo, bannerImage] = await Promise.all([
              brand.logo
                ? db("uploads").where({ id: brand.logo }).first()
                : null,
              brand.bannerImage
                ? db("uploads").where({ id: brand.bannerImage }).first()
                : null,
            ]);

            brand = {
              ...brand,
              logo: logo ? logo.file : null,
              bannerImage: bannerImage ? bannerImage.file : null,
            };
          }
        }

        const categories = product.category_ids
          ? await db("categories")
              .whereIn("id", product.category_ids)
              .select("*")
          : [];
        const subcategories = product.subcategory_ids
          ? await db("subcategories")
              .whereIn("id", product.subcategory_ids)
              .select("*")
          : [];
        const sizes = product.size_ids
          ? await db("sizes").whereIn("id", product.size_ids).select("*")
          : [];
        const colors = product.color_ids
          ? await db("colors").whereIn("id", product.color_ids).select("*")
          : [];

        const variants = product.variant_ids
          ? await db("product_variants")
              .whereIn("id", product.variant_ids)
              .select("*")
          : [];

        const populatedVariants = await Promise.all(
          variants.map(async (variant) => {
            const materials = variant.material_ids
              ? await db("materials")
                  .whereIn("id", variant.material_ids)
                  .select("*")
              : [];

            const materialsWithImage = await Promise.all(
              materials.map(async (material) => {
                const material_image = material.material_image_id
                  ? await db("uploads")
                      .where({ id: material.material_image_id })
                      .first()
                  : null;

                return {
                  ...material,
                  material_image: material_image ? material_image.file : null,
                };
              })
            );

            return { ...variant, materialsWithImage };
          })
        );

        const images = product.images
          ? await db("uploads").whereIn("id", product.images).select("*")
          : [];

        const productDescriptions = await db("product_descriptions")
          .where("product_id", product.id)
          .select("*");

        const productSpecifications = await db("product_specifications")
          .where("product_id", product.id)
          .select("*");

        const questions = await db("product_questions")
          .where("product_id", product.id)
          .select("*");

        const questionsWithAnswers = await Promise.all(
          questions.map(async (question) => {
            const answers = await db("product_answers")
              .where("question_id", question.id)
              .select("*");
            return { ...question, answers };
          })
        );

        return {
          ...product,
          brand: brand || null,
          categories: categories || [],
          subcategories: subcategories || [],
          sizes: sizes || [],
          colors: colors || [],
          variants: populatedVariants || [],
          productDescriptions: productDescriptions || [],
          productSpecifications: productSpecifications || [],
          questions: questionsWithAnswers || [],
          images: images.map((img) => img.file) || [],
        };
      })
    );

    return {
      total: parseInt(count),
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
      products: populatedProducts,
    };
  },

  getById: async (id) => {
    const product = await db("products").where("id", id).first();
    if (!product) return null;

    let brand = null;
    if (product.brand_id) {
      brand = await db("brands").where({ id: product.brand_id }).first();
      if (brand) {
        const [logo, bannerImage] = await Promise.all([
          brand.logo ? db("uploads").where({ id: brand.logo }).first() : null,
          brand.bannerImage
            ? db("uploads").where({ id: brand.bannerImage }).first()
            : null,
        ]);

        brand = {
          ...brand,
          logo: logo ? logo.file : null,
          bannerImage: bannerImage ? bannerImage.file : null,
        };
      }
    }

    const categories = product.category_ids
      ? await db("categories").whereIn("id", product.category_ids).select("*")
      : [];
    const subcategories = product.subcategory_ids
      ? await db("subcategories")
          .whereIn("id", product.subcategory_ids)
          .select("*")
      : [];
    const sizes = product.size_ids
      ? await db("sizes").whereIn("id", product.size_ids).select("*")
      : [];
    const colors = product.color_ids
      ? await db("colors").whereIn("id", product.color_ids).select("*")
      : [];

    // Fetch variants
    const variants = product.variant_ids
      ? await db("product_variants")
          .whereIn("id", product.variant_ids)
          .select("*")
      : [];

    // Populate material_ids for each variant
    const populatedVariants = await Promise.all(
      variants.map(async (variant) => {
        const materials = variant.material_ids
          ? await db("materials")
              .whereIn("id", variant.material_ids)
              .select("*")
          : [];

        const materialsWithImage = await Promise.all(
          materials.map(async (material) => {
            const material_image = material.material_image_id
              ? await db("uploads")
                  .where({ id: material.material_image_id })
                  .first()
              : null;

            return {
              ...material,
              material_image: material_image ? material_image.file : null,
            };
          })
        );

        return { ...variant, materialsWithImage };
      })
    );

    const images = product.images
      ? await db("uploads").whereIn("id", product.images).select("*")
      : [];

    const productDescriptions = await db("product_descriptions")
      .where("product_id", product.id)
      .select("*");

    const productSpecifications = await db("product_specifications")
      .where("product_id", product.id)
      .select("*");

    const questions = await db("product_questions")
      .where("product_id", product.id)
      .select("*");
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await db("product_answers")
          .where("question_id", question.id)
          .select("*");
        return { ...question, answers };
      })
    );

    return {
      ...product,
      brand: brand || null,
      categories: categories || [],
      subcategories: subcategories || [],
      sizes: sizes || [],
      colors: colors || [],
      variants: populatedVariants || [],
      productDescriptions: productDescriptions || [],
      productSpecifications: productSpecifications || [],
      questions: questionsWithAnswers || [],
      images: images.map((img) => img.file) || [],
    };
  },

  // Create a new product
  create: async (data) => {
    const newProduct = { id: uuidv4(), ...data };
    const insertedProduct = await db("products")
      .insert(newProduct)
      .returning("*");
    return insertedProduct[0];
  },

  // Create multiple products
  createMultiple: async (products) => {
    const productsWithIds = products.map((product) => ({
      id: uuidv4(),
      ...product,
    }));
    return await db("products").insert(productsWithIds).returning("*");
  },

  // Update product
  update: async (id, data) => {
    return await db("products").where({ id }).update(data).returning("*");
  },

  // Delete product
  delete: async (id) => {
    return await db("products").where({ id }).del();
  },

  queryProducts: async (filters) => {
    let query = db("products");

    if (filters.isFeatured) query.where("is_featured", true);
    if (filters.trending) query.orderBy("views", "desc");
    if (filters.isNew)
      query.where(
        "created_at",
        ">=",
        dayjs().subtract(7, "days").toISOString()
      );
    if (filters.topSelling) query.orderBy("number_sold", "desc");
    if (filters.topChoice)
      query.orderByRaw("(likes + number_sold + average_rating) DESC");
    if (filters.category)
      query.whereRaw("? = ANY(category_ids)", [filters.category]);
    if (filters.subcategory)
      query.whereRaw("? = ANY(subcategory_ids)", [filters.subcategory]);
    if (filters.discount) query.where("is_discounted", true);

    console.log("Generated SQL:", query.toString());

    const products = await query.select("*");

    return await Promise.all(
      products.map(async (product) => {
        let brand = null;
        if (product.brand_id) {
          brand = await db("brands").where({ id: product.brand_id }).first();
          if (brand) {
            const [logo, bannerImage] = await Promise.all([
              brand.logo
                ? db("uploads").where({ id: brand.logo }).first()
                : null,
              brand.bannerImage
                ? db("uploads").where({ id: brand.bannerImage }).first()
                : null,
            ]);

            brand = {
              ...brand,
              logo: logo ? logo.file : null,
              bannerImage: bannerImage ? bannerImage.file : null,
            };
          }
        }

        const categories = product.category_ids
          ? await db("categories")
              .whereIn("id", product.category_ids)
              .select("*")
          : [];
        const subcategories = product.subcategory_ids
          ? await db("subcategories")
              .whereIn("id", product.subcategory_ids)
              .select("*")
          : [];
        const sizes = product.size_ids
          ? await db("sizes").whereIn("id", product.size_ids).select("*")
          : [];
        const colors = product.color_ids
          ? await db("colors").whereIn("id", product.color_ids).select("*")
          : [];

        // Fetch variants and their materials
        const variants = product.variant_ids
          ? await db("product_variants")
              .whereIn("id", product.variant_ids)
              .select("*")
          : [];

        const populatedVariants = await Promise.all(
          variants.map(async (variant) => {
            const materials = variant.material_ids
              ? await db("materials")
                  .whereIn("id", variant.material_ids)
                  .select("*")
              : [];

            const materialsWithImage = await Promise.all(
              materials.map(async (material) => {
                const material_image = material.material_image_id
                  ? await db("uploads")
                      .where({ id: material.material_image_id })
                      .first()
                  : null;

                return {
                  ...material,
                  material_image: material_image ? material_image.file : null,
                };
              })
            );
            return { ...variant, materialsWithImage };
          })
        );

        const images = product.images
          ? await db("uploads").whereIn("id", product.images).select("*")
          : [];

        const productDescriptions = await db("product_descriptions")
          .where("product_id", product.id)
          .select("*");

        const productSpecifications = await db("product_specifications")
          .where("product_id", product.id)
          .select("*");

        const questions = await db("product_questions")
          .where("product_id", product.id)
          .select("*");

        const questionsWithAnswers = await Promise.all(
          questions.map(async (question) => {
            const answers = await db("product_answers")
              .where("question_id", question.id)
              .select("*");
            return { ...question, answers };
          })
        );

        return {
          ...product,
          brand: brand || null,
          categories: categories || [],
          subcategories: subcategories || [],
          sizes: sizes || [],
          colors: colors || [],
          variants: populatedVariants || [],
          productDescriptions: productDescriptions || [],
          productSpecifications: productSpecifications || [],
          questions: questionsWithAnswers || [],
          images: images.map((img) => img.file) || [],
        };
      })
    );
  },

  updateViewCount: async (id) => {
    return await db("products")
      .where({ id })
      .increment("views", 1)
      .returning("*");
  },

  updateLikeCount: async (id, increment = true) => {
    return await db("products")
      .where({ id })
      .increment("likes", increment ? 1 : -1)
      .returning("*");
  },

  toggleFeatured: async (id) => {
    const product = await db("products").where({ id }).first();
    if (!product) return null;

    const updatedProduct = await db("products")
      .where({ id })
      .update({ is_featured: !product.is_featured })
      .returning("*");

    return updatedProduct[0];
  },

  searchProducts: async (filters) => {
  let query = db("products").select("*");

  // 🔹 Keyword Search
  if (filters.keyword) {
    query.whereILike("name", `%${filters.keyword}%`);
  }

  if (filters.desc) {
    query.whereILike("description", `%${filters.desc}%`);
  }

  // 🔹 Category & Subcategory Filter
  if (filters.category) {
    query.whereRaw(`? = ANY(category_ids)`, [filters.category]);
  }
  if (filters.subcategory) {
    query.whereRaw(`? = ANY(subcategory_ids)`, [filters.subcategory]);
  }

  // 🔹 Brand Filter
  if (filters.brand) {
    query.where("brand_id", filters.brand);
  }

  // 🔹 Color & Size Filters
  if (filters.color) {
    query.whereRaw(`? = ANY(color_ids)`, [filters.color]);
  }
  if (filters.size) {
    query.whereRaw(`? = ANY(size_ids)`, [filters.size]);
  }

  // 🔹 Price Range Filter
  if (filters.min_price) {
    query.where("price", ">=", filters.min_price);
  }
  if (filters.max_price) {
    query.where("price", "<=", filters.max_price);
  }

  // 🔹 Discounted Products
  if (filters.discounted === "true") {
    query.where("is_discounted", true);
  }

  // 🔹 Featured Products
  if (filters.featured === "true") {
    query.where("is_featured", true);
  }

  // 🔹 Rating Filter
  if (filters.min_rating) {
    query.where("average_rating", ">=", filters.min_rating);
  }

  // 🔹 Sorting (price, popularity, newest)
  if (filters.sort_by) {
    if (filters.sort_by === "price_low_high") {
      query.orderBy("price", "asc");
    } else if (filters.sort_by === "price_high_low") {
      query.orderBy("price", "desc");
    } else if (filters.sort_by === "popularity") {
      query.orderBy("likes", "desc");
    } else if (filters.sort_by === "newest") {
      query.orderBy("created_at", "desc");
    }
  }

  // 🔹 Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  query.limit(limit).offset(offset);

  // 🔹 Fetch matching products
  const products = await query;
  const [{ count }] = await db("products").count("id as count");

  // 🔹 Populate Products with Additional Data
  const populatedProducts = await Promise.all(
    products.map(async (product) => {
      let brand = null;
      if (product.brand_id) {
        brand = await db("brands").where({ id: product.brand_id }).first();
        if (brand) {
          const [logo, bannerImage] = await Promise.all([
            brand.logo ? db("uploads").where({ id: brand.logo }).first() : null,
            brand.bannerImage
              ? db("uploads").where({ id: brand.bannerImage }).first()
              : null,
          ]);

          brand = {
            ...brand,
            logo: logo ? logo.file : null,
            bannerImage: bannerImage ? bannerImage.file : null,
          };
        }
      }

      const categories = product.category_ids
        ? await db("categories").whereIn("id", product.category_ids).select("*")
        : [];
      const subcategories = product.subcategory_ids
        ? await db("subcategories")
            .whereIn("id", product.subcategory_ids)
            .select("*")
        : [];
      const sizes = product.size_ids
        ? await db("sizes").whereIn("id", product.size_ids).select("*")
        : [];
      const colors = product.color_ids
        ? await db("colors").whereIn("id", product.color_ids).select("*")
        : [];
      const variants = product.variant_ids
        ? await db("product_variants")
            .whereIn("id", product.variant_ids)
            .select("*")
        : [];

      const populatedVariants = await Promise.all(
        variants.map(async (variant) => {
          const materials = variant.material_ids
            ? await db("materials")
                .whereIn("id", variant.material_ids)
                .select("*")
            : [];

          const materialsWithImage = await Promise.all(
            materials.map(async (material) => {
              const material_image = material.material_image_id
                ? await db("uploads").where({ id: material.material_image_id }).first()
                : null;

              return {
                ...material,
                material_image: material_image ? material_image.file : null,
              };
            })
          );

          return { ...variant, materialsWithImage };
        })
      );

      const images = product.images
        ? await db("uploads").whereIn("id", product.images).select("*")
        : [];

      const productDescriptions = await db("product_descriptions")
        .where("product_id", product.id)
        .select("*");

      const productSpecifications = await db("product_specifications")
        .where("product_id", product.id)
        .select("*");

      const questions = await db("product_questions")
        .where("product_id", product.id)
        .select("*");

      const questionsWithAnswers = await Promise.all(
        questions.map(async (question) => {
          const answers = await db("product_answers")
            .where("question_id", question.id)
            .select("*");
          return { ...question, answers };
        })
      );

      return {
        ...product,
        brand: brand || null,
        categories: categories || [],
        subcategories: subcategories || [],
        sizes: sizes || [],
        colors: colors || [],
        variants: populatedVariants || [],
        productDescriptions: productDescriptions || [],
        productSpecifications: productSpecifications || [],
        questions: questionsWithAnswers || [],
        images: images.map((img) => img.file) || [],
      };
    })
  );

  return {
    total: parseInt(count),
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
    products: populatedProducts,
  };
},

};

module.exports = Product;
