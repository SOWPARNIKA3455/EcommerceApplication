const express = require('express');
const productRouter = express.Router();
const {getAllProducts,getProductById,searchProducts} = require('../controllers/productController');

productRouter.get('/', getAllProducts);
productRouter.get('/search', searchProducts);
productRouter.get('/:id', getProductById);

module.exports = productRouter;
