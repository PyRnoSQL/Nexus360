const SheetsService = require('../services/googleSheetsService');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class TrainingController {
  // Get all training programs
  static async getAll(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: TrainingController.getMockData() });
      }
      const data = await SheetsService.getData(SHEETS.TRAINING);
      res.json({ success: true, data });
    } catch (error) {
      res.json({ success: true, data: TrainingController.getMockData() });
    }
  }

  // Get training KPIs
  static async getKPIs(req, res) {
    try {
      const mockKPIs = [
        { 
          program_type: 'Technical', 
          region: 'Littoral', 
          investment: 50500000, 
          participants: 95, 
          avg_improvement: 47.9,
          field_gain: 15.2,
          roi: 247, 
          rating: 'EXCELLENT' 
        },
        { 
          program_type: 'Leadership', 
          region: 'Centre', 
          investment: 22500000, 
          participants: 30, 
          avg_improvement: 35.4,
          field_gain: 12.5,
          roi: 178, 
          rating: 'GOOD' 
        },
        { 
          program_type: 'Soft Skills', 
          region: 'Ouest', 
          investment: 8500000, 
          participants: 60, 
          avg_improvement: 20.0,
          field_gain: 8.3,
          roi: 156, 
          rating: 'GOOD' 
        },
        { 
          program_type: 'Tactical', 
          region: 'Nord', 
          investment: 42500000, 
          participants: 28, 
          avg_improvement: 46.8,
          field_gain: 14.2,
          roi: 167, 
          rating: 'GOOD' 
        },
        { 
          program_type: 'Specialized', 
          region: 'Littoral', 
          investment: 28500000, 
          participants: 22, 
          avg_improvement: 56.7,
          field_gain: 19.5,
          roi: 278, 
          rating: 'EXCELLENT' 
        }
      ];
      res.json({ success: true, data: mockKPIs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get training ROI by region
  static async getROIByRegion(req, res) {
    try {
      const mockROI = [
        { region: 'Littoral', total_investment: 110000000, avg_roi: 247, participants: 137, top_program: 'Cybercrime Investigation' },
        { region: 'Centre', total_investment: 73000000, avg_roi: 198, participants: 65, top_program: 'Leadership & Command' },
        { region: 'Ouest', total_investment: 49000000, avg_roi: 167, participants: 100, top_program: 'Community Policing' },
        { region: 'Nord', total_investment: 77000000, avg_roi: 182, participants: 60, top_program: 'Anti-Terrorism Tactics' },
        { region: 'Sud', total_investment: 40000000, avg_roi: 145, participants: 45, top_program: 'Human Rights & Ethics' }
      ];
      res.json({ success: true, data: mockROI });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new training program
  static async create(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, message: 'Training program created (Demo Mode)' });
      }
      const newId = await SheetsService.getLastId(SHEETS.TRAINING);
      const values = [
        newId,
        req.body.program_name,
        req.body.region,
        req.body.program_type,
        req.body.start_date,
        req.body.end_date,
        req.body.total_cost,
        req.body.participants_count,
        req.body.completions_count,
        req.body.pre_training_score,
        req.body.post_training_score,
        req.body.field_performance_improvement
      ];
      await SheetsService.appendData(SHEETS.TRAINING, values);
      res.json({ success: true, id: newId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getMockData() {
    return [
      { 
        program_name: 'Advanced Criminal Investigation', 
        region: 'Littoral', 
        program_type: 'Technical',
        total_cost: 18500000, 
        participants_count: 45,
        completions_count: 43,
        pre_training_score: 58.5,
        post_training_score: 86.5,
        field_performance_improvement: 15.2,
        roi: 215
      },
      { 
        program_name: 'Cybercrime Investigation', 
        region: 'Littoral', 
        program_type: 'Technical',
        total_cost: 32000000, 
        participants_count: 25,
        completions_count: 24,
        pre_training_score: 45.0,
        post_training_score: 92.0,
        field_performance_improvement: 18.5,
        roi: 289
      }
    ];
  }
}

module.exports = TrainingController;
