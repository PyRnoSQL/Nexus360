const SheetsService = require('../services/sheetsService');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class FinanceController {
  static async getAll(req, res) {
    try {
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'Data service not configured' });
      const data = await SheetsService.getData(SHEETS.FINANCE);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
  }

  static async create(req, res) {
    try {
      const { transaction_date, region, unit, budget_line, allocated_amount, committed_amount, disbursed_amount } = req.body;
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'Data service not configured' });
      
      const newId = await SheetsService.getLastId(SHEETS.FINANCE);
      const isFraud = disbursed_amount > allocated_amount;
      const values = [newId, transaction_date || new Date().toISOString().split('T')[0], region, unit, budget_line, allocated_amount, committed_amount || 0, disbursed_amount || 0, isFraud, 0];
      await SheetsService.appendData(SHEETS.FINANCE, values);
      res.json({ success: true, id: newId, fraud_detected: isFraud, message: isFraud ? 'Transaction with FRAUD ALERT' : 'Transaction created' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create transaction' });
    }
  }

  static async getKPIs(req, res) {
    try {
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'Data service not configured' });
      const data = await SheetsService.getData(SHEETS.FINANCE);
      const totalAllocated = data.reduce((s, r) => s + (parseFloat(r.allocated_amount) || 0), 0);
      const totalDisbursed = data.reduce((s, r) => s + (parseFloat(r.disbursed_amount) || 0), 0);
      const fraudFlags = data.filter(r => r.is_fraud_flagged === 'TRUE' || r.is_fraud_flagged === true).length;
      res.json({ success: true, data: { total_transactions: data.length, total_allocated: totalAllocated, total_disbursed: totalDisbursed, execution_rate: totalAllocated > 0 ? (totalDisbursed / totalAllocated * 100).toFixed(1) : 0, fraud_flags: fraudFlags } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch KPIs' });
    }
  }
}
module.exports = FinanceController;
