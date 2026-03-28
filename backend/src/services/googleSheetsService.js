const { sheets, SPREADSHEET_ID, isSheetsReady } = require('../config/googleSheets');

class SheetsService {
  static async appendData(sheetName, values) {
    if (!isSheetsReady()) throw new Error('Google Sheets not configured');
    try {
      return await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [values] }
      });
    } catch (error) {
      console.error(`Error appending to ${sheetName}:`, error.message);
      throw new Error(`Failed to append data to ${sheetName}`);
    }
  }

  static async getData(sheetName) {
    if (!isSheetsReady()) throw new Error('Google Sheets not configured');
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`
      });
      const rows = response.data.values;
      if (!rows || rows.length <= 1) return [];
      const headers = rows[0];
      return rows.slice(1).map((row, index) => {
        const obj = { row_index: index + 2 };
        headers.forEach((header, colIndex) => {
          obj[header.toLowerCase()] = row[colIndex] || null;
        });
        return obj;
      });
    } catch (error) {
      console.error(`Error reading ${sheetName}:`, error.message);
      throw new Error(`Failed to read data from ${sheetName}`);
    }
  }

  static async updateCell(sheetName, cell, value) {
    if (!isSheetsReady()) throw new Error('Google Sheets not configured');
    try {
      return await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!${cell}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[value]] }
      });
    } catch (error) {
      console.error(`Error updating cell ${cell}:`, error.message);
      throw new Error(`Failed to update cell ${cell}`);
    }
  }

  static async getLastId(sheetName, idColumn = 'A') {
    if (!isSheetsReady()) throw new Error('Google Sheets not configured');
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!${idColumn}:${idColumn}`
      });
      const values = response.data.values || [];
      const lastId = values.length > 1 ? parseInt(values[values.length - 1][0]) || 0 : 0;
      return lastId + 1;
    } catch (error) {
      return 1;
    }
  }
}

module.exports = SheetsService;
