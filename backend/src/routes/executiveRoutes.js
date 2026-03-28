const express = require('express');
const router = express.Router();
const ExecutiveController = require('../controllers/executiveController');
const { authenticate } = require('../middleware/auth');

router.get('/dashboard', authenticate, ExecutiveController.getDashboard);
router.get('/alerts', authenticate, ExecutiveController.getAlerts);

module.exports = router;
