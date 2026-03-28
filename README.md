# NEXUS360 - DGSN Command Center

## Complete Data Platform for Cameroon's National Security

### Architecture
- **Backend**: Node.js API on Railway
- **Frontend**: React PWA on Railway  
- **Data Layer**: Google Sheets (Staging) + BigQuery (Analytics)
- **Dashboards**: Looker Studio

### Quick Deploy
1. Clone this repo
2. Set up Google Sheets API credentials
3. Configure BigQuery dataset
4. Deploy backend: `cd backend && npm start`
5. Deploy frontend: `cd frontend && npm start`

### Demo Mode
Set `DEMO_MODE=true` to enable mock data for presentations.

### Documentation
See `/docs` folder for API docs, deployment guide, and demo script.
