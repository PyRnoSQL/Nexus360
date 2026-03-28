// Power BI Configuration
const POWER_BI_CONFIG = {
  workspaceId: process.env.POWER_BI_WORKSPACE_ID,
  reportIds: {
    operations: process.env.POWER_BI_REPORT_ID_OPERATIONS,
    logistics: process.env.POWER_BI_REPORT_ID_LOGISTICS,
    hr: process.env.POWER_BI_REPORT_ID_HR,
    training: process.env.POWER_BI_REPORT_ID_TRAINING,
    finance: process.env.POWER_BI_REPORT_ID_FINANCE,
    executive: process.env.POWER_BI_REPORT_ID_EXECUTIVE
  },
  embedToken: process.env.POWER_BI_EMBED_TOKEN
};

// Check if Power BI is configured
const isPowerBiConfigured = () => {
  return !!(POWER_BI_CONFIG.workspaceId && POWER_BI_CONFIG.embedToken);
};

// Get report configuration for a specific module
const getReportConfig = (module) => {
  const reportId = POWER_BI_CONFIG.reportIds[module];
  if (!reportId || !isPowerBiConfigured()) {
    return null;
  }
  
  return {
    type: 'report',
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&workspaceId=${POWER_BI_CONFIG.workspaceId}`,
    accessToken: POWER_BI_CONFIG.embedToken,
    tokenType: 0,
    settings: {
      filterPaneEnabled: true,
      navContentPaneEnabled: true,
      layoutType: 0
    }
  };
};

module.exports = { 
  POWER_BI_CONFIG, 
  isPowerBiConfigured, 
  getReportConfig 
};
