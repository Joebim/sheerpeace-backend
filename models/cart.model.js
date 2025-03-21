const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return [];
    }
  }
  return [];
}

function formatArrayForPostgres(array) {
  if (!Array.isArray(array)) return "{}"; // Return an empty array literal if the input is invalid
  return `{${array.map((id) => `"${id}"`).join(",")}}`; // Format as PostgreSQL array literal
}

const getCart = async (userId) => {
  // Fetch the cart
  const cart = await db("carts").where({ user_id: userId }).first();
  if (!cart) return null;

  // Fetch all cart items associated with the cart
  const items = await getItems(cart.id);

  // Extract cart item IDs and store in `cartitem_ids`
  cart.cartitem_ids = items.map((item) => item.id);

  return {
    ...cart,
    items,
  };
};

const getItems = async (cartId) => {
  // Fetch cart items for the given cart_id
  const items = await db("cart_items").where({ cart_id: cartId }).select("*");

  if (items.length === 0) return [];

  // Extract product IDs for batch query
  const productIds = items.map((item) => item.product_id);

  // Fetch product details in a single query
  const products = await db("products").whereIn("id", productIds).select("*");

  // Extract all image IDs from products
  const imageIds = products
    .flatMap((product) => product.images || [])
    .filter((id) => id); // Remove null/undefined

  // Fetch images in a single batch query
  const uploadedImages = imageIds.length
    ? await db("uploads").whereIn("id", imageIds).select("*")
    : [];

  // Create a map of image ID → file URL
  const imageMap = new Map(uploadedImages.map((img) => [img.id, img.file]));

  // Map products and attach images
  const productMap = new Map(
    products.map((product) => [
      product.id,
      {
        ...product,
        images: (product.images || []).map(
          (imgId) => imageMap.get(imgId) || null
        ),
      },
    ])
  );

  // Populate cart items with product details and selected options
  const populatedItems = await Promise.all(
    items.map(async (item) => {
      const product = productMap.get(item.product_id) || null;

      // Ensure selected attributes are arrays
      const selected_sizes = ensureArray(item.selected_sizes);
      const selected_variants = ensureArray(item.selected_variants);
      const selected_colors = ensureArray(item.selected_colors);

      // Fetch selected sizes, variants, and colors in batch queries
      const [sizes, variants, colors] = await Promise.all([
        selected_sizes.length
          ? db("sizes").whereIn("id", selected_sizes).select("*")
          : [],
        selected_variants.length
          ? db("product_variants").whereIn("id", selected_variants).select("*")
          : [],
        selected_colors.length
          ? db("colors").whereIn("id", selected_colors).select("*")
          : [],
      ]);

      return {
        ...item,
        product, // Attach product details with images
        selected_sizes: sizes,
        selected_variants: variants,
        selected_colors: colors,
      };
    })
  );

  return populatedItems;
};

// Get a cart item by its ID
const getItemById = async (cartItemId) => {
  // Fetch the cart item
  const item = await db("cart_items").where({ id: cartItemId }).first();
  if (!item) return null;

  // Fetch product details
  const product = await db("products").where({ id: item.product_id }).first();

  // Fetch selected attributes
  const selected_sizes = ensureArray(item.selected_sizes);
  const selected_variants = ensureArray(item.selected_variants);
  const selected_colors = ensureArray(item.selected_colors);

  // Fetch related attributes in batch queries
  const [sizes, variants, colors] = await Promise.all([
    selected_sizes.length
      ? db("sizes").whereIn("id", selected_sizes).select("*")
      : [],
    selected_variants.length
      ? db("product_variants").whereIn("id", selected_variants).select("*")
      : [],
    selected_colors.length
      ? db("colors").whereIn("id", selected_colors).select("*")
      : [],
  ]);

  return {
    ...item,
    product,
    selected_sizes: sizes,
    selected_variants: variants,
    selected_colors: colors,
  };
};

// Create a new cart
const create = (data) =>
  db("carts")
    .insert({
      id: uuidv4(),
      ...data,
    })
    .returning("*");

const deleteCart = (id) => db("carts").where({ id }).del();

// Add item to cart
const addItem = (data) =>
  db("cart_items")
    .insert({
      id: uuidv4(),
      ...data,
    })
    .returning("*");

const addItems = async (items, cartId) => {
  const formattedItems = items.map((item) => ({
    cart_id: cartId,
    id: uuidv4(),
    ...item,
  }));
  console.log('formattedItems', formattedItems)
  return db("cart_items").insert(formattedItems).returning("*");
};

// Update cart item quantity
const updateItemQuantity = (cartItemId, quantity) =>
  db("cart_items")
    .where({ id: cartItemId })
    .update({ quantity })
    .returning("*");

// Remove item from cart
const removeItem = (cartItemId) =>
  db("cart_items").where({ id: cartItemId }).del();

const removeItems = async (cartId) => {
  return db("cart_items").where({ cart_id: cartId }).del();
}
// Update total items and total price for a cart
const updateCartTotals = async (cartId) => {
  // Calculate total items
  const totalItems = await db("cart_items")
    .where({ cart_id: cartId })
    .sum({ total: "quantity" }) // Use object syntax for aliasing
    .first();

  // Calculate total price
  const totalPrice = await db("cart_items")
    .join("products", "cart_items.product_id", "products.id")
    .where("cart_items.cart_id", cartId)
    .select(db.raw("SUM(cart_items.quantity * products.price) AS total")) // Corrected syntax
    .first();

  // Update the cart with new totals
  return db("carts")
    .where({ id: cartId })
    .update({
      total_items: totalItems?.total || 0,
      total_price: totalPrice?.total || 0.0,
    })
    .returning("*");
};

const updateItem = async (cartItemId, data) => {
  // Format arrays for PostgreSQL
  if (data.selected_sizes) {
    data.selected_sizes = formatArrayForPostgres(data.selected_sizes);
  }
  if (data.selected_variants) {
    data.selected_variants = formatArrayForPostgres(data.selected_variants);
  }
  if (data.selected_colors) {
    data.selected_colors = formatArrayForPostgres(data.selected_colors);
  }

  const updatedItem = await db("cart_items")
    .where({ id: cartItemId })
    .update(data)
    .returning("*");

  return updatedItem.length ? updatedItem[0] : null;
};

module.exports = {
  getCart,
  getItems,
  getItemById,
  create,
  deleteCart,
  addItem,
  addItems,
  updateItemQuantity,
  removeItem,
  removeItems,
  updateCartTotals,
  updateItem,
};
