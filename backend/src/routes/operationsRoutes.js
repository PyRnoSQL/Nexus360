const express = require('express');
const router = express.Router();
const OperationsController = require('../controllers/operationsController');
const { authenticate } = require('../middleware/auth');
const { validate, incidentSchema } = require('../middleware/validation');

router.get('/incidents', authenticate, OperationsController.getAllIncidents);
router.get('/hotzones', authenticate, OperationsController.getHotzoneMap);
router.post('/incidents', authenticate, validate(incidentSchema), OperationsController.createIncident);

module.exports = router;
