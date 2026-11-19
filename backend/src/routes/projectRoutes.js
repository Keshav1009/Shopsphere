const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, projectController.getProjects);
router.get('/:id', optionalAuth, projectController.getProjectById);
router.post('/', verifyToken, projectController.createProject);
router.put('/:id', verifyToken, projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);

module.exports = router;
