
const jwt = require('jsonwebtoken');

const authSeller = (req, res, next) => {
  try {
    const { token } = req.cookies || {};

    if (!token) {
      return res.status(401).json({ message: 'User not authorized, no token' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken || decodedToken.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied: Sellers only' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('JWT error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    res.status(401).json({ message: 'Unauthorized: Token invalid or expired' });
  }
};

module.exports = authSeller;
