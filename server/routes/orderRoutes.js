const express = require('express');
const orderRouter = express.Router();
const {placeOrder,getOrderById,getUserOrders,getAllOrders,markAsPaid,} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
orderRouter.use(protect);

orderRouter.post('/', placeOrder);
orderRouter.get('/my-orders', getUserOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.get('/', adminOnly, getAllOrders);
orderRouter.put('/:id/paid', markAsPaid);

module.exports = orderRouter;
