const express = require('express');
const router = express.Router();
const LeanController = require('../controllers/leanController');
const { authenticate } = require('../middleware/auth');
const { requireModuleAccess } = require('../middleware/rbac');

// All LEAN routes require authentication and LEAN module access
router.use(authenticate);
router.use(requireModuleAccess('lean'));

// LEAN routes
router.get('/', LeanController.getAll);
router.get('/kpis', LeanController.getKPIs);
router.get('/savings-summary', LeanController.getSavingsSummary);
router.post('/', LeanController.create);

module.exports = router;
