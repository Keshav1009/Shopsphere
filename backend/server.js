/**
 * E-Commerce Storefront - Backend REST API Server
 * Developed for BCA-311 Summer Training Project
 * MNB Soft Solutions Pvt. Ltd. Internship
 */

const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const db = require('./src/db/database');
const requestLogger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const seedDatabase = require('./seed');

const app = express();

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'MNB E-Commerce Storefront',
    paperCode: 'BCA-311',
    organization: 'MNB Soft Solutions Pvt. Ltd.',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Mount API Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 Route Catch-all
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

// Bootstrapping Server with Automatic Seed Check
async function startServer() {
  try {
    await db.initSchema();

    // Check if products exist; auto-seed if empty
    const productCountRow = await db.getAsync('SELECT COUNT(*) as count FROM products');
    if (!productCountRow || productCountRow.count === 0) {
      console.log('⚡ Empty database detected. Running automatic initial seed...');
      await seedDatabase();
    }

    const server = app.listen(config.PORT, () => {
      console.log(`================================================================`);
      console.log(`🚀 MNB E-COMMERCE STOREFRONT API SERVER RUNNING`);
      console.log(`📡 URL: http://localhost:${config.PORT}`);
      console.log(`📚 Paper Code: BCA-311 | Company: MNB Soft Solutions Pvt. Ltd.`);
      console.log(`🔑 Admin Login: admin@mnbsolutions.com / Admin@123`);
      console.log(`👤 User Login:  user@mnbsolutions.com / User@123`);
      console.log(`================================================================`);
    });

    return server;
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Start server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
