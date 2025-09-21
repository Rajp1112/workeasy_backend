const jwt = require('jsonwebtoken');
const User = require('../models/user-models');

// ✅ Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(" ")[1];

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // get user from DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    req.userId = user._id;
    req.role = user.role; // attach role

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// ✅ Role-based middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
