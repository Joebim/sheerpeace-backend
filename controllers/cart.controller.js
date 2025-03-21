const Cart = require("../models/cart.model");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../config/db");

function extractIds(array) {
  if (!Array.isArray(array)) return [];
  return array.map((item) => item.id).filter((id) => id); // Extract IDs and filter out undefined/null
}

function formatArrayForPostgres(array) {
  if (!Array.isArray(array)) return "{}"; // Return an empty array literal if the input is invalid
  return `{${array.map((id) => `"${id}"`).join(",")}}`; // Format as PostgreSQL array literal
}

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

// Get cart by user ID
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.getCart(userId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const items = await Cart.getItems(cart.id);
    res.json({ ...cart, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart (Creates cart if none exists)
exports.addItem = async (req, res) => {
  try {
    const {
      product_id,
      quantity,
      selected_sizes,
      selected_variants,
      selected_colors,
    } = req.body;
    const userId = req.user.id;

    // Check if the user already has a cart
    let cart = await Cart.getCart(userId);

    if (!cart) {
      // Create a new cart if none exists
      const [newCart] = await Cart.create({
        user_id: userId,
        total_items: 0,
        total_price: 0.0,
      });
      cart = newCart;
    }

    // Add the item to the cart
    const [item] = await Cart.addItem({
      cart_id: cart.id,
      product_id: product_id,
      quantity,
      selected_sizes,
      selected_variants,
      selected_colors,
    });

    // Update cart totals
    await Cart.updateCartTotals(cart.id);

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addItems = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    let cart = await Cart.getCart(userId);

    if (!cart.id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid cartId or items array" });
    }

    const addedItems = await Cart.addItems(items, cart.id);
    await Cart.updateCartTotals(cart.id);
    return res.status(201).json({ success: true, items: addedItems });
  } catch (error) {
    console.error("Error adding multiple items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Update item quantity by product ID
exports.updateItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Fetch the user's cart
    const cart = await Cart.getCart(userId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Find the cart item by product ID
    const cartItem = await db("cart_items")
      .where({ cart_id: cart.id, product_id: productId })
      .first();

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Update the item quantity
    const [updatedItem] = await Cart.updateItemQuantity(cartItem.id, quantity);

    // Update cart totals
    await Cart.updateCartTotals(cart.id);

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart by product ID
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Fetch the user's cart
    const cart = await Cart.getCart(userId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Find the cart item by product ID
    const cartItem = await db("cart_items")
      .where({ cart_id: cart.id, product_id: productId })
      .first();

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Remove the item from the cart
    await Cart.removeItem(cartItem.id);

    // Update cart totals
    await Cart.updateCartTotals(cart.id);

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.synchronizeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const mergedCart = req.body.cart;

    if (!mergedCart || !Array.isArray(mergedCart.items)) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    // Fetch or create the server cart
    let serverCart = await Cart.getCart(userId);

    if (!serverCart) {
      // If no server cart exists, create a new one
      const [newCart] = await Cart.create({
        id: mergedCart.id || uuidv4(),
        user_id: userId,
        total_items: mergedCart.total_items || 0,
        total_price: mergedCart.total_price || 0.0,
        created_at: mergedCart.created_at || new Date().toISOString(),
      });
      serverCart = newCart;
    }

    // Ensure the server cart has an ID
    if (!serverCart.id) {
      return res
        .status(500)
        .json({ error: "Failed to create or retrieve the server cart" });
    }

    // Remove existing cart items before adding new ones
    await Cart.removeItems(serverCart.id);

    // Add merged cart items to the server
    const formattedItems = mergedCart.items.map((item) => ({
      id: item.id || uuidv4(),
      cart_id: serverCart.id,
      product_id: item.product_id,
      quantity: item.quantity,
      selected_sizes: formatArrayForPostgres(item.selected_sizes.map(size => size.id) || []),
      selected_variants: formatArrayForPostgres(item.selected_variants.map(variant => variant.id) || []),
      selected_colors: formatArrayForPostgres(item.selected_colors.map(color => color.id) || []),
      created_at: item.created_at || new Date().toISOString(),
    }));

    await Cart.addItems(formattedItems, serverCart.id);

    // Update cart totals
    await Cart.updateCartTotals(serverCart.id);

    // Fetch the updated server cart
    const updatedCart = await Cart.getCart(userId);
    updatedCart.items = await Cart.getItems(serverCart.id);

    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Cart synchronization failed:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.delete(id);
    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const updatedItem = await Cart.updateItem(cartItemId, req.body);
    if (!updatedItem)
      return res.status(404).json({ message: "Cart item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
