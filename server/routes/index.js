const express = require('express');
const router = express.Router();

const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const orderRouter = require('./orderRoutes');
const cartRouter = require('./cartRoutes');
const reviewRouter = require('./reviewRoutes');
const adminRouter= require('./adminRoutes');

router.use('/user', userRouter);         
router.use('/products', productRouter);  
router.use('/orders', orderRouter);      
router.use('/cart', cartRouter);        
router.use('/reviews', reviewRouter);    
router.use('/admin',adminRouter);        

module.exports = router;


