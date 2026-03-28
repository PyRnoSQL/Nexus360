const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/trainingController');
const { authenticate } = require('../middleware/auth');
const { requireModuleAccess } = require('../middleware/rbac');

// All training routes require authentication and training module access
router.use(authenticate);
router.use(requireModuleAccess('training'));

// Training routes
router.get('/', TrainingController.getAll);
router.get('/kpis', TrainingController.getKPIs);
router.get('/roi-by-region', TrainingController.getROIByRegion);
router.post('/', TrainingController.create);

module.exports = router;
