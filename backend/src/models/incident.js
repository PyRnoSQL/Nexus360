const { v4: uuidv4 } = require('uuid');

class Incident {
  constructor(data) {
    this.incident_id = data.incident_id || uuidv4();
    this.officer_id = data.officer_id;
    this.incident_type = data.incident_type;
    this.region = data.region;
    this.city = data.city;
    this.description = data.description;
    this.incident_date = data.incident_date || new Date().toISOString();
    this.severity = data.severity;
    this.assigned_precinct = data.assigned_precinct;
    this.assigned_email = data.assigned_email;
    this.status = data.status || 'open';
    this.time_to_complete = data.time_to_complete;
    this.approved_by = data.approved_by;
    this.photo_url = data.photo_url;
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  // Severity levels with time to complete (hours)
  static getSeverityConfig() {
    return {
      low: { time_to_complete: 24, color: '#4caf50', priority: 1 },
      medium: { time_to_complete: 48, color: '#ff9800', priority: 2 },
      high: { time_to_complete: 72, color: '#f44336', priority: 3 },
      critical: { time_to_complete: 12, color: '#d32f2f', priority: 4 }
    };
  }

  // Status options
  static getStatusOptions() {
    return ['open', 'in-progress', 'escalated to parquet', 'closed'];
  }

  // Regions of Cameroon
  static getRegions() {
    return [
      'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
      'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
    ];
  }

  // Cities by region
  static getCitiesByRegion(region) {
    const cities = {
      'Adamaoua': ['Ngaoundéré', 'Tibati', 'Meiganga', 'Banyo'],
      'Centre': ['Yaoundé', 'Mbalmayo', 'Mfou', 'Obala', 'Akono'],
      'Est': ['Bertoua', 'Batouri', 'Yokadouma', 'Abong-Mbang'],
      'Extrême-Nord': ['Maroua', 'Mokolo', 'Kousséri', 'Yagoua'],
      'Littoral': ['Douala', 'Nkongsamba', 'Yabassi', 'Manjo', 'Loum'],
      'Nord': ['Garoua', 'Poli', 'Tcholliré', 'Lagon'],
      'Nord-Ouest': ['Bamenda', 'Kumbo', 'Mbengwi', 'Wum'],
      'Ouest': ['Bafoussam', 'Dschang', 'Foumban', 'Bandjoun'],
      'Sud': ['Ebolowa', 'Kribi', 'Ambam', 'Sangmélima'],
      'Sud-Ouest': ['Buea', 'Limbe', 'Kumba', 'Tiko']
    };
    return cities[region] || [];
  }

  // Incident types
  static getIncidentTypes() {
    return [
      'Armed Robbery', 'Burglary', 'Assault', 'Carjacking', 'Homicide',
      'Kidnapping', 'Drug Trafficking', 'Human Trafficking', 'Domestic Violence',
      'Cyber Crime', 'Traffic Accident', 'Public Disturbance', 'Illegal Arms',
      'Corruption', 'Fraud', 'Vandalism', 'Sexual Assault', 'Missing Person'
    ];
  }
}

module.exports = Incident;
