const SheetsService = require('../services/googleSheetsService');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class LeanController {
  // Get all process improvements
  static async getAll(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: LeanController.getMockData() });
      }
      const data = await SheetsService.getData(SHEETS.LEAN);
      res.json({ success: true, data });
    } catch (error) {
      res.json({ success: true, data: LeanController.getMockData() });
    }
  }

  // Get LEAN KPIs
  static async getKPIs(req, res) {
    try {
      const mockKPIs = [
        { 
          region: 'Littoral', 
          improvements: 12, 
          savings: 8750000, 
          avg_time_saved: 36.5,
          efficiency_gain: 68.5,
          quality_score: 88, 
          rating: 'EXCELLENT' 
        },
        { 
          region: 'Centre', 
          improvements: 8, 
          savings: 5200000, 
          avg_time_saved: 42.8,
          efficiency_gain: 72.3,
          quality_score: 82, 
          rating: 'GOOD' 
        },
        { 
          region: 'Ouest', 
          improvements: 5, 
          savings: 2850000, 
          avg_time_saved: 28.5,
          efficiency_gain: 62.5,
          quality_score: 75, 
          rating: 'SATISFACTORY' 
        },
        { 
          region: 'Nord', 
          improvements: 6, 
          savings: 4100000, 
          avg_time_saved: 32.0,
          efficiency_gain: 58.2,
          quality_score: 78, 
          rating: 'GOOD' 
        },
        { 
          region: 'Sud', 
          improvements: 4, 
          savings: 1950000, 
          avg_time_saved: 45.5,
          efficiency_gain: 71.4,
          quality_score: 72, 
          rating: 'SATISFACTORY' 
        }
      ];
      res.json({ success: true, data: mockKPIs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get cumulative savings summary
  static async getSavingsSummary(req, res) {
    try {
      const mockSummary = {
        total_improvements: 35,
        total_savings: 22850000,
        avg_efficiency_gain: 66.6,
        best_practice_diffusion: 8,
        institutional_quality_score: 79,
        projected_annual_savings: 45600000
      };
      res.json({ success: true, data: mockSummary });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new process improvement
  static async create(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, message: 'Improvement recorded (Demo Mode)' });
      }
      const newId = await SheetsService.getLastId(SHEETS.LEAN);
      const values = [
        newId,
        req.body.region,
        req.body.process_name,
        req.body.baseline_time_hours,
        req.body.improved_time_hours,
        req.body.baseline_cost_fcfa,
        req.body.improved_cost_fcfa,
        req.body.implementation_date,
        req.body.savings_realized_fcfa,
        req.body.quality_impact_score,
        req.body.adopted_by_other_units || false
      ];
      await SheetsService.appendData(SHEETS.LEAN, values);
      res.json({ success: true, id: newId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getMockData() {
    return [
      { 
        process_name: 'Incident Reporting Workflow', 
        region: 'Littoral', 
        baseline_time_hours: 48,
        improved_time_hours: 12,
        savings_realized_fcfa: 1650000, 
        quality_impact_score: 9,
        adopted_by_other_units: true
      },
      { 
        process_name: 'Payroll Verification', 
        region: 'Centre', 
        baseline_time_hours: 72,
        improved_time_hours: 8,
        savings_realized_fcfa: 1400000, 
        quality_impact_score: 8,
        adopted_by_other_units: true
      }
    ];
  }
}

module.exports = LeanController;
