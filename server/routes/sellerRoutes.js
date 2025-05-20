const express = require('express');
const sellerRouter = express.Router();
const {addProduct,updateProduct,deleteProduct,getMyProducts,getOrders} = require('../controllers/sellerController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

sellerRouter.use(protect, sellerOnly);
sellerRouter.post('/product', addProduct);
sellerRouter.put('/product/:id', updateProduct);
sellerRouter.delete('/product/:id', deleteProduct);
sellerRouter.get('/products', getMyProducts);
sellerRouter.get('/orders', getOrders);


module.exports = sellerRouter;
