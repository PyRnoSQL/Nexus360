const { isBigQueryReady } = require('../config/bigquery');

class ExecutiveController {
  static async getDashboard(req, res) {
    try {
      const mockData = {
        summary: { total_savings_annual: 2750000000, total_investment: 8700000000, roi_percentage: 316, payback_years: 3.2 },
        modules: {
          finance: [{ month: '2026-01', budget_execution_rate_pct: 87.5, estimated_savings: 450000000 }],
          hr: [{ region: 'Littoral', payroll_integrity_score: 98.5 }],
          lean: [{ region: 'Littoral', cumulative_savings: 1650000, quality_score: 88 }]
        }
      };
      res.json({ success: true, data: mockData, mock: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load dashboard' });
    }
  }

  static async getAlerts(req, res) {
    try {
      const mockHotzones = [{
        district: 'Douala 1er', latitude: 4.051056, longitude: 9.767869, hotzone_level: 'CRITICAL HOTZONE',
        risk_score: 4.8, incident_count_90d: 23, predicted_incidents_next_7days: 8.5, recommended_patrol_units: 8
      }];
      const mockMaintenance = [{
        vehicle_registration: 'LT 1235 A', asset_type: 'Patrol Car', vehicle_health_score: 35,
        failure_risk_pct: 92, maintenance_recommendation: 'IMMEDIATE REPAIR', immediate_repair_cost_fcfa: 850000
      }];
      res.json({ success: true, data: { critical_alerts: 2, hotzone_alerts: mockHotzones, maintenance_alerts: mockMaintenance } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load alerts' });
    }
  }
}
module.exports = ExecutiveController;
