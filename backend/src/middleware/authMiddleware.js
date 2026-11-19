const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await db.getAsync(
      'SELECT id, name, email, role, region, bio, tech_stack, portfolio_url FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User account no longer exists.'
      });
    }

    try {
      user.tech_stack = JSON.parse(user.tech_stack || '[]');
    } catch {
      user.tech_stack = [];
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.'
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for role-based access.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires one of the following roles: [${roles.join(', ')}].`
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await db.getAsync(
        'SELECT id, name, email, role, region FROM users WHERE id = ?',
        [decoded.id]
      );
      if (user) req.user = user;
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
};

module.exports = {
  verifyToken,
  requireRole,
  optionalAuth
};
