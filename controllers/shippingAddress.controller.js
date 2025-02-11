const ShippingAddress = require('../models/shippingAddress.model');

// Get all shipping addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await ShippingAddress.getByUserId(userId);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new shipping address
exports.createAddress = async (req, res) => {
  try {
    const { userId, address_line1, address_line2, city, state, postal_code, country } = req.body;
    const [address] = await ShippingAddress.create({
      user_id: userId,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a shipping address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const [address] = await ShippingAddress.update(id, data);
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a shipping address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await ShippingAddress.delete(id);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};