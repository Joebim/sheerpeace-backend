const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Cart = {
  // Get cart by user ID
  getCart: async (userId) => {
    // Fetch the cart
    const cart = await db("carts").where({ user_id: userId }).first();
    if (!cart) return null;

    // Fetch all cart items associated with the cart
    const items = await db("cart_items")
      .where({ cart_id: cart.id })
      .select("*");

    // Extract cart item IDs and store in `cartitem_ids`
    cart.cartitem_ids = items.map((item) => item.id);

    return {
      ...cart,
    };
  },

  getItems: async (cartId) => {
    const items = await db("cart_items").where({ cart_id: cartId }).select("*");

    // Populate selected_sizes, selected_materials, and selected_colors
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        // Ensure selected options are parsed into arrays
        const sizeIds = Array.isArray(item.selected_sizes)
          ? item.selected_sizes
          : JSON.parse(item.selected_sizes || "[]");

        const materialIds = Array.isArray(item.selected_materials)
          ? item.selected_materials
          : JSON.parse(item.selected_materials || "[]");

        const colorIds = Array.isArray(item.selected_colors)
          ? item.selected_colors
          : JSON.parse(item.selected_colors || "[]");

        // Fetch selected sizes
        const selected_sizes = sizeIds.length
          ? await db("sizes").whereIn("id", sizeIds).select("*")
          : [];

        // Fetch selected materials
        const selected_materials = materialIds.length
          ? await db("materials").whereIn("id", materialIds).select("*")
          : [];

        // Fetch selected colors
        const selected_colors = colorIds.length
          ? await db("colors").whereIn("id", colorIds).select("*")
          : [];

        return {
          ...item,
          selected_sizes,
          selected_materials,
          selected_colors,
        };
      })
    );
    
    return populatedItems;
  },

  // Create a new cart
  create: (data) =>
    db("carts")
      .insert({
        id: uuidv4(),
        ...data,
      })
      .returning("*"),

  delete: (id) => db("carts").where({ id }).del(),

  // Add item to cart
  addItem: (data) =>
    db("cart_items")
      .insert({
        id: uuidv4(),
        ...data,
      })
      .returning("*"),

  // Update cart item quantity
  updateItemQuantity: (cartItemId, quantity) =>
    db("cart_items")
      .where({ id: cartItemId })
      .update({ quantity })
      .returning("*"),

  // Remove item from cart
  removeItem: (cartItemId) => db("cart_items").where({ id: cartItemId }).del(),

  // Get cart items by cart ID

  // Update total items and total price for a cart
  updateCartTotals: async (cartId) => {
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
  },
};

module.exports = Cart;
