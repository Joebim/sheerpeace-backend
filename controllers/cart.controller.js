const Cart = require('../models/cart.model');

// Get cart by user ID
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.getByUserId(userId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const items = await Cart.getItems(cart.id);
    res.json({ ...cart, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const [item] = await Cart.addItem({ cart_id: cartId, product_id: productId, quantity });
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
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await Cart.removeItem(cartItemId);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};