const Order =require('../models/Order.js');

const initiatePayment = async (req, res) => {
  const { orderId, amount } = req.body;
  res.json({ clientSecret: `mock_secret_${orderId}` });
};

const confirmPayment = async (req, res) => {
  const { orderId, paymentResult } = req.body;
  const order = await Order.findById(orderId);

  if (!order) throw new Error('Order not found');

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = paymentResult;

  await order.save();
  res.json({ message: 'Payment successful', order });
};

 const getPaymentStatus = async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new Error('Order not found');
  res.json({ isPaid: order.isPaid, paidAt: order.paidAt });
};
module.exports ={initiatePayment,confirmPayment,getPaymentStatus}
