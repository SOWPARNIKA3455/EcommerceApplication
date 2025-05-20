const express = require('express');
const {initiatePayment,confirmPayment,getPaymentStatus} = require('../controllers/paymentController.js');
const {protect} = require('../middleware/authMiddleware.js');

const paymentRouter = express.Router();  

paymentRouter.use(protect);
paymentRouter.post('/initiate', initiatePayment);
paymentRouter.post('/confirm', confirmPayment);
paymentRouter.get('/status/:orderId', getPaymentStatus);

module.exports = paymentRouter;
