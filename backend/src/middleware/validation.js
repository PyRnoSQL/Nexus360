const Joi = require('joi');
const Incident = require('../models/incident');

// Incident validation schema
const incidentSchema = Joi.object({
  officer_id: Joi.string().optional(),
  incident_type: Joi.string().valid(...Incident.getIncidentTypes()).required(),
  region: Joi.string().valid(...Incident.getRegions()).required(),
  city: Joi.string().required(),
  description: Joi.string().min(10).max(2000).required(),
  incident_date: Joi.date().max('now').required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  assigned_precinct: Joi.when('severity', {
    is: Joi.string().valid('high', 'critical'),
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  assigned_email: Joi.when('severity', {
    is: Joi.string().valid('high', 'critical'),
    then: Joi.string().email().required(),
    otherwise: Joi.string().email().optional()
  })
});

const validateIncident = (req, res, next) => {
  const { error, value } = incidentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }
  req.body = value;
  next();
};

module.exports = { validateIncident };
