const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:referenceId', verifyToken, messageController.getMessagesByReference);
router.post('/', verifyToken, messageController.sendMessage);

module.exports = router;
