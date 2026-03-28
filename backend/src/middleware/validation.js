const Joi = require('joi');
<<<<<<< HEAD
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
=======

const financeSchema = Joi.object({
  transaction_date: Joi.date().required(),
  region: Joi.string().required().max(50),
  unit: Joi.string().required().max(100),
  budget_line: Joi.string().required().max(100),
  allocated_amount: Joi.number().positive().required(),
  committed_amount: Joi.number().min(0).default(0),
  disbursed_amount: Joi.number().min(0).default(0)
}).custom((value, helpers) => {
  if (value.disbursed_amount > value.allocated_amount) return helpers.error('disbursed_amount cannot exceed allocated_amount');
  return value;
});

const incidentSchema = Joi.object({
  incident_date: Joi.date().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  region: Joi.string().required().max(50),
  district: Joi.string().required().max(100),
  incident_type: Joi.string().required().max(50),
  severity_level: Joi.number().min(1).max(5).required(),
  officers_assigned: Joi.number().min(0).default(0)
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: 'Validation error', details: error.details.map(d => d.message) });
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
  req.body = value;
  next();
};

<<<<<<< HEAD
module.exports = { validateIncident };
=======
module.exports = { validate, financeSchema, incidentSchema };
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
