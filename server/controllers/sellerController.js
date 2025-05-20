const Product = require('../models/Product.js');
const Order = require('../models/Order.js');

const addProduct = async (req, res) => {
  const { title, price, stock, description } = req.body;
  const product = await Product.create({ title,price,stock,description,seller: req.user._id, });
  res.status(201).json(product);
};

const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
};

const updateProduct = async (req, res) => {
  const { title, price, stock, description } = req.body;
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    { title, price, stock, description },
    { new: true }
  );
  res.json(product);
};

const deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  res.json({ message: 'Product deleted' });
};

const getOrders = async (req, res) => {
  const orders = await Order.find({ 'orderItems.seller': req.user._id });
  res.json(orders);
};
module.exports = {addProduct,getMyProducts,updateProduct,deleteProduct,getOrders}
