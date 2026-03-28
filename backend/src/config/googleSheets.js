const { google } = require('googleapis');
const path = require('path');

let auth;
try {
  if (process.env.GOOGLE_SHEETS_PRIVATE_KEY && process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    const keyFile = path.join(__dirname, '../../service-account-key.json');
    auth = new google.auth.GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  }
} catch (error) {
  console.error('Failed to initialize Google Sheets auth:', error.message);
  auth = null;
}

const sheets = auth ? google.sheets({ version: 'v4', auth }) : null;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEETS = { FINANCE: 'finance_transactions', HR: 'hr_employees', INCIDENTS: 'incidents', FLEET: 'fleet_assets', TRAINING: 'training_programs', LEAN: 'process_improvements', USERS: 'users', AUDIT: 'audit_logs' };
const isSheetsReady = () => !!(sheets && SPREADSHEET_ID);

module.exports = { sheets, SPREADSHEET_ID, SHEETS, isSheetsReady };
