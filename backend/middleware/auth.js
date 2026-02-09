const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Issuer = require('../models/Issuer');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request based on role
    if (decoded.role === 'student') {
      req.student = await Student.findById(decoded.id);
      req.userRole = 'student';
      req.user = req.student;   // ✅ IMPORTANT FIX
    } 
    else if (decoded.role === 'issuer') {
      req.issuer = await Issuer.findById(decoded.id);
      req.userRole = 'issuer';
      req.user = req.issuer;    // ✅ IMPORTANT FIX
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.userRole} is not authorized to access this route`
      });
    }
    next();
  };
};
