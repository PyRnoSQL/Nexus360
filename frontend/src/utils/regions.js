export const REGIONS = {
  'Adamaoua': ['Ngaoundéré', 'Tibati', 'Meiganga', 'Banyo', 'Djohong'],
  'Centre': ['Yaoundé', 'Mbalmayo', 'Mfou', 'Obala', 'Akono', 'Ngoumou', 'Monatélé'],
  'Est': ['Bertoua', 'Batouri', 'Yokadouma', 'Abong-Mbang', 'Doumé', 'Lomié'],
  'Extrême-Nord': ['Maroua', 'Mokolo', 'Kousséri', 'Yagoua', 'Mora', 'Kaélé'],
  'Littoral': ['Douala', 'Nkongsamba', 'Yabassi', 'Manjo', 'Loum', 'Dibombari'],
  'Nord': ['Garoua', 'Poli', 'Tcholliré', 'Lagon', 'Rey Bouba', 'Figuil'],
  'Nord-Ouest': ['Bamenda', 'Kumbo', 'Mbengwi', 'Wum', 'Nkambe', 'Ndop'],
  'Ouest': ['Bafoussam', 'Dschang', 'Foumban', 'Bandjoun', 'Bangangté', 'Mbouda'],
  'Sud': ['Ebolowa', 'Kribi', 'Ambam', 'Sangmélima', 'Mvangan', 'Olamze'],
  'Sud-Ouest': ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe', 'Mutengene']
};

export const INCIDENT_TYPES = [
  'Armed Robbery', 'Burglary', 'Assault', 'Carjacking', 'Homicide',
  'Kidnapping', 'Drug Trafficking', 'Human Trafficking', 'Domestic Violence',
  'Cyber Crime', 'Traffic Accident', 'Public Disturbance', 'Illegal Arms',
  'Corruption', 'Fraud', 'Vandalism', 'Sexual Assault', 'Missing Person',
  'Theft', 'Riot', 'Terrorism', 'Border Incident'
];

export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#4caf50', priority: 1, timeToComplete: 24 },
  { value: 'medium', label: 'Medium', color: '#ff9800', priority: 2, timeToComplete: 48 },
  { value: 'high', label: 'High', color: '#f44336', priority: 3, timeToComplete: 72 },
  { value: 'critical', label: 'Critical', color: '#d32f2f', priority: 4, timeToComplete: 12 }
];
