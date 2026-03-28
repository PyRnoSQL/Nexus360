const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const IncidentsController = require('../controllers/incidentsController');
const { authenticate } = require('../middleware/auth');
const { requireModuleAccess } = require('../middleware/rbac');
const { validateIncident } = require('../middleware/validation');

// All incident routes require authentication
router.use(authenticate);

// Incident management routes
router.get('/', IncidentsController.getAll);
router.get('/kpis', IncidentsController.getKPIs);
router.get('/stats/region', IncidentsController.getStatsByRegion);
router.get('/trends', IncidentsController.getTrends);
router.post('/', upload.single('photo'), validateIncident, IncidentsController.create);
router.patch('/:id/status', IncidentsController.updateStatus);

module.exports = router;
