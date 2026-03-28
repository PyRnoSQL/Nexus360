const { BigQuery } = require('@google-cloud/bigquery');
let bigquery;
const DATASET_ID = process.env.BIGQUERY_DATASET || 'nexus360';

try {
  if (process.env.GCP_PROJECT_ID) {
    bigquery = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
    });
  } else {
    bigquery = new BigQuery({ projectId: process.env.GCP_PROJECT_ID || 'nexus360-project' });
  }
} catch (error) {
  console.error('Failed to initialize BigQuery:', error.message);
  bigquery = null;
}

const isBigQueryReady = () => !!bigquery;
module.exports = { bigquery, DATASET_ID, isBigQueryReady };
