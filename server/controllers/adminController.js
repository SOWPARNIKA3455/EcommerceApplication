const Admin = require('../models/User'); 
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const createToken = require('../utilis/generateToken');
const Product = require('../models/Product');
const Order = require('../models/Order');

const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, profilePic } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      profilePic,
      role: 'admin',
    });

    const savedAdmin = await newAdmin.save();

    const adminWithoutPassword = savedAdmin.toObject();
    delete adminWithoutPassword.password;

    res.status(201).json({
      message: "Admin account created",
      admin: adminWithoutPassword,
    });

  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }
    const admin = await Admin.findOne({ email, role: 'admin' }).select('+password');
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = createToken(admin._id, 'admin');

    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('token'); 
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    const adminData = admin.toObject();
    delete adminData.password;

    return res.status(200).json({
      message: "Admin login successful",
      admin: adminData,
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user?._id;
    const adminData = await Admin.findById(adminId).select('-password');
    return res.status(200).json({
      data: adminData,
      message: "Admin profile retrieved"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};

const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: "Admin logged out successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};
const updateAdmin = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const { name, email, password, profilePic } = req.body || {};

    const updatedFields = { name, email, profilePic };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updatedFields },
      { new: true }
    ).select('-password');

    res.status(200).json({
      data: updatedAdmin,
      message: "Admin profile updated"
    });

  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};
const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(adminId).select('-password');

    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      data: deletedAdmin,
      message: "Admin deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};
const checkAdminRole = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ authorized: false, error: "Access denied" });
    }
    res.status(200).json({ role: user.role, authorized: true });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      error: error.message || "Internal server error"
    });
  }
};
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

const verifyProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new Error('Product not found');

  product.isVerified = true;
  await product.save();
  res.json({ message: 'Product verified' });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});
module.exports = {adminSignup, adminLogin,getAdminProfile,adminLogout,updateAdmin,deleteAdmin,checkAdminRole,getAllUsers,verifyProduct,getAllOrders};

