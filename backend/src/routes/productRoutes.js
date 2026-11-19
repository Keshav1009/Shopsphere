const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { validateProduct } = require('../middleware/requestValidator');

// Public catalog
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Reviews (authenticated users)
router.post('/:id/reviews', verifyToken, productController.addReview);

// Admin / Vendor product management
router.post('/', verifyToken, requireRole('admin', 'vendor'), validateProduct, productController.createProduct);
router.put('/:id', verifyToken, requireRole('admin', 'vendor'), productController.updateProduct);
router.delete('/:id', verifyToken, requireRole('admin', 'vendor'), productController.deleteProduct);

module.exports = router;
