const { getReportConfig, isPowerBiConfigured } = require('../config/powerbi');

class PowerBiService {
  // Get embed configuration for a report
  static async getEmbedConfig(module, userId = null, userRole = null) {
    if (!isPowerBiConfigured()) {
      return {
        success: false,
        error: 'Power BI not configured',
        config: null
      };
    }
    
    const config = getReportConfig(module);
    
    if (!config) {
      return {
        success: false,
        error: `Report not found for module: ${module}`,
        config: null
      };
    }
    
    // Add RLS filters if user role is provided
    if (userId && userRole) {
      config.filters = {
        userId: userId,
        role: userRole
      };
    }
    
    return {
      success: true,
      config: config
    };
  }
  
  // Generate embed token (in production, call Power BI API)
  static async generateEmbedToken(reportId, workspaceId) {
    // In production, this would call the Power BI API
    // For demo, return mock token
    return {
      token: process.env.POWER_BI_EMBED_TOKEN,
      expiration: new Date(Date.now() + 3600000).toISOString()
    };
  }
  
  // Validate embed token
  static async validateToken(token) {
    // In production, validate against Power BI API
    return !!token && token === process.env.POWER_BI_EMBED_TOKEN;
  }
}

module.exports = PowerBiService;
