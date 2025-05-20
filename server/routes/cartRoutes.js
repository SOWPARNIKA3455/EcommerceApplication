const express = require('express');
const cartRouter = express.Router();
const {getCart,addToCart,removeFromCart,updateCartItem} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

cartRouter.use(protect);
cartRouter.get('/', getCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update/:itemId', updateCartItem);
cartRouter.delete('/remove/:itemId', removeFromCart);

module.exports = cartRouter;

