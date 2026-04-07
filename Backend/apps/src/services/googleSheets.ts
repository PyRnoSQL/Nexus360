import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor() {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';
  }

  async getSheetData(sheetName: string): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });
      
      const rows = response.data.values || [];
      if (rows.length === 0) return [];
      
      const headers = rows[0];
      return rows.slice(1).map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
    } catch (error) {
      console.error(`Error fetching ${sheetName}:`, error);
      return [];
    }
  }

  async getColumnUniqueValues(sheetName: string, columnName: string): Promise<string[]> {
    const data = await this.getSheetData(sheetName);
    const values = data.map(row => row[columnName]).filter(v => v && v.trim() !== '');
    return [...new Set(values)];
  }

  async getFinanceOptions() {
    const data = await this.getSheetData('finance_transactions');
    return {
      budgetLines: [...new Set(data.map(row => row['budget_line']).filter(Boolean))],
      transactionTypes: [...new Set(data.map(row => row['transaction_type']).filter(Boolean))],
      departments: [...new Set(data.map(row => row['department']).filter(Boolean))],
    };
  }

  async getHROptions() {
    const data = await this.getSheetData('hr_employees');
    return {
      departments: [...new Set(data.map(row => row['department']).filter(Boolean))],
      positions: [...new Set(data.map(row => row['position']).filter(Boolean))],
      employmentTypes: [...new Set(data.map(row => row['employment_type']).filter(Boolean))],
      grades: [...new Set(data.map(row => row['grade']).filter(Boolean))],
      regions: [...new Set(data.map(row => row['region']).filter(Boolean))],
    };
  }

  async getIncidentsOptions() {
    const data = await this.getSheetData('incidents');
    return {
      incidentTypes: [...new Set(data.map(row => row['incident_type']).filter(Boolean))],
      cities: [...new Set(data.map(row => row['city']).filter(Boolean))],
      regions: [...new Set(data.map(row => row['region']).filter(Boolean))],
      statuses: [...new Set(data.map(row => row['status']).filter(Boolean))],
      priorities: [...new Set(data.map(row => row['priority']).filter(Boolean))],
    };
  }

  async getFleetOptions() {
    const data = await this.getSheetData('fleet_assets');
    return {
      vehicleTypes: [...new Set(data.map(row => row['vehicle_type']).filter(Boolean))],
      statuses: [...new Set(data.map(row => row['status']).filter(Boolean))],
      locations: [...new Set(data.map(row => row['location']).filter(Boolean))],
    };
  }

  async getTrainingOptions() {
    const data = await this.getSheetData('training_programs');
    return {
      categories: [...new Set(data.map(row => row['category']).filter(Boolean))],
      levels: [...new Set(data.map(row => row['level']).filter(Boolean))],
      durations: [...new Set(data.map(row => row['duration']).filter(Boolean))],
    };
  }

  async getLeanOptions() {
    const data = await this.getSheetData('process_improvements');
    return {
      processTypes: [...new Set(data.map(row => row['process_type']).filter(Boolean))],
      impactLevels: [...new Set(data.map(row => row['impact_level']).filter(Boolean))],
      statuses: [...new Set(data.map(row => row['status']).filter(Boolean))],
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
