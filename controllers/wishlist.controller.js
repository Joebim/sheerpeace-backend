const Wishlist = require('../models/wishlist.model');

exports.getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getUserWishlist(req.user.id);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    const [wishlistItem] = await Wishlist.addProduct(req.user.id, product_id);
    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    const wishlistItem = await Wishlist.removeProduct(req.user.id, product_id);
    if (!wishlistItem.length) return res.status(404).json({ error: 'Item not found in wishlist' });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
