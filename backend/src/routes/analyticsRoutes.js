const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Admin Analytics & Forecasting
router.get('/summary', verifyToken, requireRole('admin'), analyticsController.getSummary);
router.get('/breakdowns', verifyToken, requireRole('admin'), analyticsController.getBreakdowns);
router.get('/forecast', verifyToken, requireRole('admin'), analyticsController.getForecast);

module.exports = router;
