const express = require('express');
const {
  adminSignup,
  adminLogin,
  adminLogout,
  getAdminProfile,
  checkAdminRole,
  getAllOrders,
  verifyProduct,
  getAllUsers
  } = require('../controllers/adminController');

const authAdmin = require('../middleware/authAdmin');

const adminRouter = express.Router();

adminRouter.post('/signup', adminSignup);
adminRouter.post('/login', adminLogin);
adminRouter.post('/logout',authAdmin,adminLogout);
adminRouter.get('/profile', authAdmin, getAdminProfile);
adminRouter.get('/check-role', authAdmin, checkAdminRole);
adminRouter.get('/orders', getAllOrders);
adminRouter.put('/verify-product/:id', verifyProduct);
adminRouter.get('/users', getAllUsers);

module.exports = adminRouter;
