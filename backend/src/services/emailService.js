const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async sendIncidentNotification(incident) {
    if (!this.transporter || !incident.assigned_email) return false;

    const severityConfig = {
      low: { color: '#4caf50', urgency: 'Low Priority' },
      medium: { color: '#ff9800', urgency: 'Medium Priority' },
      high: { color: '#f44336', urgency: 'HIGH PRIORITY' },
      critical: { color: '#d32f2f', urgency: 'URGENT - CRITICAL' }
    };

    const config = severityConfig[incident.severity.toLowerCase()] || severityConfig.medium;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #1a237e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .alert { background: ${config.color}; color: white; padding: 10px; text-align: center; border-radius: 5px; }
          .details { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #1a237e; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DGSN NEXUS360 - Incident Report</h1>
        </div>
        <div class="content">
          <div class="alert">
            <h2>${config.urgency} Incident Assigned</h2>
          </div>
          
          <div class="details">
            <h3>Incident Details</h3>
            <p><strong>Incident ID:</strong> ${incident.incident_id}</p>
            <p><strong>Type:</strong> ${incident.incident_type}</p>
            <p><strong>Location:</strong> ${incident.city}, ${incident.region}</p>
            <p><strong>Severity:</strong> ${incident.severity.toUpperCase()}</p>
            <p><strong>Reported:</strong> ${new Date(incident.created_at).toLocaleString()}</p>
            <p><strong>Time to Complete:</strong> ${incident.time_to_complete} hours</p>
            <p><strong>Description:</strong> ${incident.description}</p>
          </div>
          
          <p>You have been assigned to lead the investigation for this incident.</p>
          <p>Please login to the NEXUS360 platform to view full details and update the incident status.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexus360.railway.app/incidents" class="button">View in NEXUS360</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from the DGSN NEXUS360 System.</p>
          <p>Powered by Analytix Engineering</p>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'nexus360@dgsn.cm',
        to: incident.assigned_email,
        subject: `[NEXUS360] ${config.urgency} - Incident ${incident.incident_id} Assigned`,
        html: html
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
