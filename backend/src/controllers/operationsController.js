const SheetsService = require('../services/sheetsService');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class OperationsController {
  static async getAllIncidents(req, res) {
    try {
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'Data service not configured' });
      const data = await SheetsService.getData(SHEETS.INCIDENTS);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch incidents' });
    }
  }

  static async createIncident(req, res) {
    try {
      const { incident_date, latitude, longitude, region, district, incident_type, severity_level, officers_assigned } = req.body;
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'Data service not configured' });
      
      const newId = await SheetsService.getLastId(SHEETS.INCIDENTS);
      const values = [newId, incident_date || new Date().toISOString(), latitude, longitude, region, district, incident_type, severity_level, null, false, officers_assigned || 0];
      await SheetsService.appendData(SHEETS.INCIDENTS, values);
      res.json({ success: true, id: newId, message: 'Incident reported' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create incident' });
    }
  }

  static async getHotzoneMap(req, res) {
    const mockHotzones = [
      { region: 'Littoral', district: 'Douala 1er', latitude: 4.051056, longitude: 9.767869, incident_count_90d: 23, risk_score: 4.8, hotzone_level: 'CRITICAL HOTZONE', predicted_incidents_next_7days: 8.5, recommended_patrol_units: 8 },
      { region: 'Centre', district: 'Yaoundé 3e', latitude: 3.866667, longitude: 11.516667, incident_count_90d: 15, risk_score: 3.9, hotzone_level: 'HIGH RISK ZONE', predicted_incidents_next_7days: 5.2, recommended_patrol_units: 5 }
    ];
    res.json({ success: true, data: mockHotzones, mock: true });
  }
}
module.exports = OperationsController;
