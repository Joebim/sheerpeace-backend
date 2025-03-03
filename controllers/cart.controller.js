const Cart = require("../models/cart.model");

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
      selected_materials,
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
      selected_materials,
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

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.delete(id);
    res.json({ message: 'Cart deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
