const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, financeSchema } = require('../middleware/validation');

router.get('/', authenticate, FinanceController.getAll);
router.get('/kpis', authenticate, FinanceController.getKPIs);
router.post('/', authenticate, authorize('super_admin', 'commander'), validate(financeSchema), FinanceController.create);

module.exports = router;
