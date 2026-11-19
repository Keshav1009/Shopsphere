const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/requestValidator');

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.get('/users', verifyToken, requireRole('admin'), authController.getAllUsers);

module.exports = router;
