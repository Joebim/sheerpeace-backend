const Cart = require("../models/cart.model");

function extractIds(array) {
  if (!Array.isArray(array)) return [];
  return array.map((item) => item.id).filter((id) => id); // Extract IDs and filter out undefined/null
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

// Update item quantity
exports.updateItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const [item] = await Cart.updateItemQuantity(cartItemId, quantity);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await Cart.updateCartTotals(item.cart_id); // Update cart totals after quantity change

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await Cart.getItemById(cartItemId);

    if (!cartItem) return res.status(404).json({ error: "Item not found" });

    await Cart.removeItem(cartItemId);
    await Cart.updateCartTotals(cartItem.cart_id); // Update cart totals after removing an item

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.synchronizeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomingCart = req.body.cart;

    if (!incomingCart || !Array.isArray(incomingCart.items)) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    // Fetch the server cart for the user
    let serverCart = await Cart.getCart(userId);

    if (!serverCart) {
      // If no server cart exists, create a new one using the client cart data
      const [newCart] = await Cart.create({
        id: incomingCart.id || uuidv4(), // Use the client cart ID if provided
        user_id: userId,
        total_items: incomingCart.total_items || 0,
        total_price: incomingCart.total_price || 0.0,
        created_at: incomingCart.created_at || new Date().toISOString(),
      });
      serverCart = newCart;

      // Add items from the client cart to the new server cart
      for (const item of incomingCart.items) {
        await Cart.addItem({
          id: item.id || uuidv4(), // Use the client item ID if provided
          cart_id: serverCart.id,
          product_id: item.product_id,
          quantity: item.quantity,
          selected_sizes: JSON.stringify(extractIds(item.selected_sizes)), // Extract IDs
          selected_variants: JSON.stringify(extractIds(item.selected_variants)), // Extract IDs
          selected_colors: JSON.stringify(extractIds(item.selected_colors)), // Extract IDs
          created_at: item.created_at || new Date().toISOString(),
        });
      }
    } else {
      // Reconcile the client cart with the server cart
      const serverItems = await Cart.getItems(serverCart.id);
      const serverItemsMap = new Map(
        serverItems.map((item) => [item.product_id, item])
      );

      const reconciledItems = [...serverItems];

      for (const clientItem of incomingCart.items) {
        const serverItem = serverItemsMap.get(clientItem.product_id);

        if (serverItem) {
          // If the item exists in both carts, update the quantity to the maximum value
          serverItem.quantity = Math.max(serverItem.quantity, clientItem.quantity);

          // Merge selected sizes, variants, and colors (extract IDs)
          const serverSizes = extractIds(ensureArray(serverItem.selected_sizes));
          const serverVariants = extractIds(ensureArray(serverItem.selected_variants));
          const serverColors = extractIds(ensureArray(serverItem.selected_colors));

          const clientSizes = extractIds(ensureArray(clientItem.selected_sizes));
          const clientVariants = extractIds(ensureArray(clientItem.selected_variants));
          const clientColors = extractIds(ensureArray(clientItem.selected_colors));

          serverItem.selected_sizes = [
            ...new Set([...serverSizes, ...clientSizes]),
          ];
          serverItem.selected_variants = [
            ...new Set([...serverVariants, ...clientVariants]),
          ];
          serverItem.selected_colors = [
            ...new Set([...serverColors, ...clientColors]),
          ];

          // Update the item in the database
          await Cart.updateItem(serverItem.id, {
            quantity: serverItem.quantity,
            selected_sizes: JSON.stringify(serverItem.selected_sizes), // Store as JSON string
            selected_variants: JSON.stringify(serverItem.selected_variants), // Store as JSON string
            selected_colors: JSON.stringify(serverItem.selected_colors), // Store as JSON string
          });
        } else {
          // If the item exists only in the client cart, add it to the server cart
          const [newItem] = await Cart.addItem({
            id: clientItem.id || uuidv4(), // Use the client item ID if provided
            cart_id: serverCart.id,
            product_id: clientItem.product_id,
            quantity: clientItem.quantity,
            selected_sizes: JSON.stringify(extractIds(clientItem.selected_sizes)), // Extract IDs
            selected_variants: JSON.stringify(extractIds(clientItem.selected_variants)), // Extract IDs
            selected_colors: JSON.stringify(extractIds(clientItem.selected_colors)), // Extract IDs
            created_at: clientItem.created_at || new Date().toISOString(),
          });

          reconciledItems.push(newItem);
        }
      }

      // Update the server cart with the new totals
      await Cart.updateCartTotals(serverCart.id);
    }

    // Fetch the updated server cart with populated items
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
