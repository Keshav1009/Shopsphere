const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { validateOrder } = require('../middleware/requestValidator');

// Customer endpoints
router.post('/', verifyToken, validateOrder, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', verifyToken, orderController.getOrderById);

// Admin endpoints
router.get('/admin/all', verifyToken, requireRole('admin'), orderController.getAllOrders);
router.put('/:id/status', verifyToken, requireRole('admin'), orderController.updateOrderStatus);

module.exports = router;
