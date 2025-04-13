const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        error: 'No authorization token provided'
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid authorization format'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and attach to request
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          error: 'User not found'
        });
      }

      // Attach user and token to request
      req.user = user;
      req.token = token;
      next();
    } catch (e) {
      console.error('Token verification error:', e);
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          status: 'error',
          error: 'Token expired'
        });
      }
      return res.status(401).json({
        status: 'error',
        error: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Server error during authentication'
    });
  }
};

module.exports = auth;
