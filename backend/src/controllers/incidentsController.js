const SheetsService = require('../services/googleSheetsService');
const EmailService = require('../services/emailService');
const Incident = require('../models/incident');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class IncidentsController {
  // Get all incidents
  static async getAll(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: IncidentsController.getMockIncidents() });
      }

      const data = await SheetsService.getData(SHEETS.INCIDENTS);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Get incidents error:', error);
      res.json({ success: true, data: IncidentsController.getMockIncidents() });
    }
  }

  // Create new incident
  static async create(req, res) {
    try {
      const incidentData = req.body;
      const photoFile = req.file;
      
      // Validate required fields
      const requiredFields = ['incident_type', 'region', 'city', 'description', 'severity'];
      for (const field of requiredFields) {
        if (!incidentData[field]) {
          return res.status(400).json({ success: false, error: `Missing required field: ${field}` });
        }
      }

      // Create incident object
      const incident = new Incident({
        officer_id: req.user?.id || incidentData.officer_id,
        incident_type: incidentData.incident_type,
        region: incidentData.region,
        city: incidentData.city,
        description: incidentData.description,
        incident_date: incidentData.incident_date,
        severity: incidentData.severity,
        assigned_precinct: incidentData.assigned_precinct,
        assigned_email: incidentData.assigned_email,
        status: 'open',
        approved_by: null,
        photo_url: photoFile ? `/uploads/${photoFile.filename}` : null
      });

      // Set time to complete based on severity
      const severityConfig = Incident.getSeverityConfig();
      incident.time_to_complete = severityConfig[incident.severity.toLowerCase()]?.time_to_complete || 48;

      if (!isSheetsReady()) {
        // Demo mode - just return success
        if (incident.assigned_email) {
          await EmailService.sendIncidentNotification(incident);
        }
        return res.json({
          success: true,
          data: incident,
          message: 'Incident reported successfully (Demo Mode)',
          notification_sent: !!incident.assigned_email
        });
      }

      // Save to Google Sheets
      const newId = await SheetsService.getLastId(SHEETS.INCIDENTS);
      const values = [
        newId,
        incident.incident_id,
        incident.officer_id,
        incident.incident_type,
        incident.region,
        incident.city,
        incident.description,
        incident.incident_date,
        incident.severity,
        incident.assigned_precinct || '',
        incident.assigned_email || '',
        incident.status,
        incident.time_to_complete,
        incident.approved_by || '',
        incident.photo_url || '',
        incident.created_at,
        incident.updated_at
      ];

      await SheetsService.appendData(SHEETS.INCIDENTS, values);

      // Send email notification if assigned
      if (incident.assigned_email && incident.severity.toLowerCase() !== 'low') {
        await EmailService.sendIncidentNotification(incident);
      }

      res.json({
        success: true,
        data: incident,
        message: 'Incident reported successfully',
        notification_sent: !!incident.assigned_email
      });
    } catch (error) {
      console.error('Create incident error:', error);
      res.status(500).json({ success: false, error: 'Failed to create incident' });
    }
  }

  // Update incident status
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, approved_by } = req.body;

      if (!status || !Incident.getStatusOptions().includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }

      if (!isSheetsReady()) {
        return res.json({ success: true, message: 'Status updated (Demo Mode)' });
      }

      const incidents = await SheetsService.getData(SHEETS.INCIDENTS);
      const incidentIndex = incidents.findIndex(i => i.incident_id == id);

      if (incidentIndex === -1) {
        return res.status(404).json({ success: false, error: 'Incident not found' });
      }

      const rowNumber = incidentIndex + 2;
      await SheetsService.updateCell(SHEETS.INCIDENTS, `L${rowNumber}`, status);
      
      if (approved_by) {
        await SheetsService.updateCell(SHEETS.INCIDENTS, `N${rowNumber}`, approved_by);
      }

      res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
      console.error('Update incident error:', error);
      res.status(500).json({ success: false, error: 'Failed to update incident' });
    }
  }

  // Get incident KPIs
  static async getKPIs(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: IncidentsController.getMockKPIs() });
      }

      const incidents = await SheetsService.getData(SHEETS.INCIDENTS);
      const kpis = IncidentsController.calculateKPIs(incidents);
      res.json({ success: true, data: kpis });
    } catch (error) {
      console.error('Get KPIs error:', error);
      res.json({ success: true, data: IncidentsController.getMockKPIs() });
    }
  }

  // Get incident statistics by region
  static async getStatsByRegion(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: IncidentsController.getMockRegionStats() });
      }

      const incidents = await SheetsService.getData(SHEETS.INCIDENTS);
      const stats = IncidentsController.calculateRegionStats(incidents);
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Get region stats error:', error);
      res.json({ success: true, data: IncidentsController.getMockRegionStats() });
    }
  }

  // Get incident trends (time series)
  static async getTrends(req, res) {
    try {
      if (!isSheetsReady()) {
        return res.json({ success: true, data: IncidentsController.getMockTrends() });
      }

      const incidents = await SheetsService.getData(SHEETS.INCIDENTS);
      const trends = IncidentsController.calculateTrends(incidents);
      res.json({ success: true, data: trends });
    } catch (error) {
      console.error('Get trends error:', error);
      res.json({ success: true, data: IncidentsController.getMockTrends() });
    }
  }

  // Calculate KPIs
  static calculateKPIs(incidents) {
    if (!incidents || incidents.length === 0) return IncidentsController.getMockKPIs();

    const total = incidents.length;
    const resolved = incidents.filter(i => i.status === 'closed').length;
    const inProgress = incidents.filter(i => i.status === 'in-progress').length;
    const escalated = incidents.filter(i => i.status === 'escalated to parquet').length;
    const highSeverity = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;

    // Average resolution time (in hours)
    const resolvedIncidents = incidents.filter(i => i.status === 'closed' && i.updated_at);
    const avgResolutionTime = resolvedIncidents.reduce((sum, i) => {
      const created = new Date(i.created_at);
      const resolved = new Date(i.updated_at);
      return sum + (resolved - created) / (1000 * 60 * 60);
    }, 0) / (resolvedIncidents.length || 1);

    return {
      total_incidents: total,
      resolved_count: resolved,
      resolution_rate: total > 0 ? (resolved / total * 100).toFixed(1) : 0,
      in_progress: inProgress,
      escalated: escalated,
      high_severity: highSeverity,
      high_severity_rate: total > 0 ? (highSeverity / total * 100).toFixed(1) : 0,
      avg_resolution_time_hours: avgResolutionTime.toFixed(1),
      open_incidents: total - resolved
    };
  }

  static calculateRegionStats(incidents) {
    const regionMap = new Map();
    const regions = Incident.getRegions();

    for (const region of regions) {
      regionMap.set(region, { total: 0, high: 0, resolved: 0 });
    }

    for (const incident of incidents) {
      const region = incident.region;
      if (regionMap.has(region)) {
        const stats = regionMap.get(region);
        stats.total++;
        if (incident.severity === 'high' || incident.severity === 'critical') stats.high++;
        if (incident.status === 'closed') stats.resolved++;
      }
    }

    return Array.from(regionMap.entries()).map(([region, stats]) => ({
      region,
      total_incidents: stats.total,
      high_severity: stats.high,
      resolved: stats.resolved,
      resolution_rate: stats.total > 0 ? (stats.resolved / stats.total * 100).toFixed(1) : 0,
      severity_index: stats.total > 0 ? (stats.high / stats.total * 100).toFixed(1) : 0
    })).sort((a, b) => b.total_incidents - a.total_incidents);
  }

  static calculateTrends(incidents) {
    const trends = new Map();
    const now = new Date();
    
    // Last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      trends.set(dateKey, { date: dateKey, total: 0, high: 0 });
    }

    for (const incident of incidents) {
      const incidentDate = new Date(incident.created_at).toISOString().split('T')[0];
      if (trends.has(incidentDate)) {
        const trend = trends.get(incidentDate);
        trend.total++;
        if (incident.severity === 'high' || incident.severity === 'critical') trend.high++;
      }
    }

    return Array.from(trends.values());
  }

  static getMockIncidents() {
    return [
      { incident_id: 'INC001', region: 'Littoral', city: 'Douala', severity: 'high', status: 'in-progress' },
      { incident_id: 'INC002', region: 'Centre', city: 'Yaoundé', severity: 'critical', status: 'open' }
    ];
  }

  static getMockKPIs() {
    return {
      total_incidents: 156,
      resolved_count: 112,
      resolution_rate: 71.8,
      in_progress: 28,
      escalated: 12,
      high_severity: 34,
      high_severity_rate: 21.8,
      avg_resolution_time_hours: 36.5,
      open_incidents: 44
    };
  }

  static getMockRegionStats() {
    return [
      { region: 'Littoral', total_incidents: 45, high_severity: 12, resolution_rate: 75.6, severity_index: 26.7 },
      { region: 'Centre', total_incidents: 38, high_severity: 10, resolution_rate: 78.9, severity_index: 26.3 },
      { region: 'Ouest', total_incidents: 22, high_severity: 5, resolution_rate: 68.2, severity_index: 22.7 }
    ];
  }

  static getMockTrends() {
    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 10),
        high: Math.floor(Math.random() * 3)
      });
    }
    return trends;
  }
}

module.exports = IncidentsController;
