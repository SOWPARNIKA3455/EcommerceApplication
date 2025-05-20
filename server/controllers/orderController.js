const Order = require('../models/Order');

const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: 'pending',
  });

  res.status(201).json(order);
};

const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};

const markAsPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.paymentStatus = 'paid';
  await order.save();

  res.json({ message: 'Order marked as paid' });
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {placeOrder,getUserOrders,getAllOrders,markAsPaid,getOrderById};
