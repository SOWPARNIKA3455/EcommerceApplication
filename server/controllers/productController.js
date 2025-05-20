const Product = require('../models/Product');

const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  const product = await Product.create({
    seller: req.user._id,
    name,
    description,
    price,
    stock,
    category,
  });

  res.status(201).json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({ isVerified: true });
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

const verifyProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.isVerified = true;
  await product.save();

  res.json({ message: 'Product verified' });
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Missing search query parameter "q"' });
    }

    const products = await Product.find({
      isVerified: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error('Search Products Error:', error);
    res.status(500).json({ message: 'Server error while searching products' });
  }
};

module.exports = { createProduct,getAllProducts,getProductById,verifyProduct,searchProducts};
