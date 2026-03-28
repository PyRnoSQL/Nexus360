const express = require('express');
const router = express.Router();
const HRController = require('../controllers/hrController');
const { authenticate } = require('../middleware/auth');
const { requireModuleAccess } = require('../middleware/rbac');

// All HR routes require authentication and HR module access
router.use(authenticate);
router.use(requireModuleAccess('hr'));

// HR routes
router.get('/', HRController.getAll);
router.get('/kpis', HRController.getKPIs);
router.get('/payroll-summary', HRController.getPayrollSummary);
router.post('/', HRController.create);

module.exports = router;
