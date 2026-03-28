const SheetsService = require('../services/googleSheetsService');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class HRController {
  // Get all HR records
  static async getAll(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: HRController.getMockData() });
      }
      const data = await SheetsService.getData(SHEETS.HR);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Get HR data error:', error);
      res.json({ success: true, data: HRController.getMockData() });
    }
  }

  // Get HR KPIs
  static async getKPIs(req, res) {
    try {
      const mockKPIs = [
        { region: 'Littoral', total_personnel: 245, payroll_integrity: 98.8, ghost_risk: 0, training_hours: 42, performance_score: 86.5, annual_savings: 0 },
        { region: 'Centre', total_personnel: 189, payroll_integrity: 99.2, ghost_risk: 0, training_hours: 38, performance_score: 84.2, annual_savings: 0 },
        { region: 'Ouest', total_personnel: 156, payroll_integrity: 96.5, ghost_risk: 2, training_hours: 35, performance_score: 79.8, annual_savings: 14400000 },
        { region: 'Nord', total_personnel: 98, payroll_integrity: 97.0, ghost_risk: 1, training_hours: 32, performance_score: 81.5, annual_savings: 7200000 },
        { region: 'Sud', total_personnel: 112, payroll_integrity: 96.4, ghost_risk: 1, training_hours: 30, performance_score: 78.2, annual_savings: 7200000 }
      ];
      res.json({ success: true, data: mockKPIs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new HR record
  static async create(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, message: 'HR record created (Demo Mode)' });
      }
      const newId = await SheetsService.getLastId(SHEETS.HR);
      const values = [
        newId,
        req.body.matricule,
        req.body.full_name,
        req.body.rank,
        req.body.unit,
        req.body.base_salary,
        new Date().toISOString().split('T')[0],
        null,
        false,
        req.body.region,
        req.body.gender
      ];
      await SheetsService.appendData(SHEETS.HR, values);
      res.json({ success: true, id: newId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get payroll integrity summary
  static async getPayrollSummary(req, res) {
    try {
      const mockSummary = {
        total_personnel: 800,
        verified_personnel: 785,
        ghost_risk_count: 15,
        total_payroll: 425000000,
        potential_savings: 108000000,
        integrity_score: 98.1
      };
      res.json({ success: true, data: mockSummary });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getMockData() {
    return [
      { 
        matricule: 'DGSN/00123/LC', 
        full_name: 'Jean-Baptiste Mvondo', 
        region: 'Littoral', 
        unit: 'Sécurité Publique', 
        rank: 'Commissaire Divisionnaire', 
        base_salary: 1450000,
        present_verified: true,
        assignment_verified: true
      },
      { 
        matricule: 'DGSN/00145/LC', 
        full_name: 'Marie-Thérèse Essama', 
        region: 'Littoral', 
        unit: 'Police Judiciaire', 
        rank: 'Commissaire Principal', 
        base_salary: 1250000,
        present_verified: true,
        assignment_verified: true
      }
    ];
  }
}

module.exports = HRController;
