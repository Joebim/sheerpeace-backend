const Order = require('../models/order.model');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, shipping_address_id, total_amount, items } = req.body;

    // Create the order
    const [order] = await Order.create({
      user_id: userId,
      shipping_address_id,
      total_amount,
      status: 'pending',
    });

    // Add items to the order
    for (const item of items) {
      await Order.addItem({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = await Order.getItems(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for a user
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.getByUserId(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a payment for an order
exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, payment_method } = req.body;
    const [payment] = await Order.createPayment({
      order_id: orderId,
      amount,
      payment_method,
      status: 'pending',
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};