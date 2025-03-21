const { db } = require("../config/db");

const Wishlist = {
  getUserWishlist: async (user_id) => {
    // Fetch wishlist items for the user
    const items = await db("wishlist").where({ user_id }).select("*");
    
    if (items.length === 0) return []; // Return early if wishlist is empty

    // Extract product IDs
    const productIds = items.map((item) => item.product_id);

    // Fetch product details
    const products = await db("products").whereIn("id", productIds).select("*");

    // Extract image IDs from products
    const imageIds = products.flatMap((product) => product.images || []).filter(Boolean);

    // Fetch images
    const uploadedImages = imageIds.length
      ? await db("uploads").whereIn("id", imageIds).select("*")
      : [];

    // Create a map for image ID to file URL
    const imageMap = new Map(uploadedImages.map((img) => [img.id, img.file]));

    // Map products with their images
    const productMap = new Map(
      products.map((product) => [
        product.id,
        {
          ...product,
          images: (product.images || []).map((imgId) => imageMap.get(imgId) || null),
        },
      ])
    );

    // Attach product details to wishlist items
    const wishlistWithProducts = items.map((item) => ({
      ...item,
      product: productMap.get(item.product_id) || null,
    }));

    return wishlistWithProducts;
  },

  addProduct: (user_id, product_id) =>
    db("wishlist").insert({ user_id, product_id }).returning("*"),

  removeProduct: (user_id, product_id) =>
    db("wishlist").where({ user_id, product_id }).del().returning("*"),
};

module.exports = Wishlist;
