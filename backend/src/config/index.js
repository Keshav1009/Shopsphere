const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'mnb_secret_key_bca311_summer_training_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '../../data/ecommerce.db'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || '*'
};
