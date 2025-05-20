const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      _id: decoded.id,
      role: decoded.role || 'admin'
    };

    console.log("Authenticated admin:", req.user);
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authAdmin;