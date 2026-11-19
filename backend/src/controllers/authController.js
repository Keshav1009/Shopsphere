const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const config = require('../config');

// Register a new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', region = 'Global', bio = '', tech_stack = [], portfolio_url = '' } = req.body;

    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr_${uuidv4().substring(0, 8)}`;
    const formattedTechStack = JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []);

    await db.runAsync(
      `INSERT INTO users (id, name, email, password_hash, role, region, bio, tech_stack, portfolio_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name.trim(), email.toLowerCase().trim(), passwordHash, role, region, bio, formattedTechStack, portfolio_url]
    );

    const token = jwt.sign({ id: userId, role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role,
        region,
        bio,
        tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
        portfolio_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    let techStack = [];
    try {
      techStack = JSON.parse(user.tech_stack || '[]');
    } catch {
      techStack = [];
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region,
        bio: user.bio,
        tech_stack: techStack,
        portfolio_url: user.portfolio_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await db.getAsync(
      'SELECT id, name, email, role, region, bio, tech_stack, portfolio_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    try {
      user.tech_stack = JSON.parse(user.tech_stack || '[]');
    } catch {
      user.tech_stack = [];
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update profile / portfolio / tech stack
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, region, tech_stack, portfolio_url, role } = req.body;
    const userId = req.user.id;

    const formattedTechStack = tech_stack !== undefined ? JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []) : undefined;

    // Allow role upgrade if provided (e.g. from customer to vendor/developer)
    await db.runAsync(
      `UPDATE users SET 
        name = COALESCE(?, name),
        bio = COALESCE(?, bio),
        region = COALESCE(?, region),
        tech_stack = COALESCE(?, tech_stack),
        portfolio_url = COALESCE(?, portfolio_url),
        role = COALESCE(?, role)
       WHERE id = ?`,
      [name, bio, region, formattedTechStack, portfolio_url, role, userId]
    );

    const updatedUser = await db.getAsync(
      'SELECT id, name, email, role, region, bio, tech_stack, portfolio_url FROM users WHERE id = ?',
      [userId]
    );

    try {
      updatedUser.tech_stack = JSON.parse(updatedUser.tech_stack || '[]');
    } catch {
      updatedUser.tech_stack = [];
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.allAsync(
      'SELECT id, name, email, role, region, bio, tech_stack, portfolio_url, created_at FROM users ORDER BY created_at DESC'
    );
    const parsedUsers = users.map(u => {
      try {
        u.tech_stack = JSON.parse(u.tech_stack || '[]');
      } catch {
        u.tech_stack = [];
      }
      return u;
    });

    return res.status(200).json({
      success: true,
      count: parsedUsers.length,
      users: parsedUsers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
};
