const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
<<<<<<< HEAD
const path = require('path');
const rateLimit = require('express-rate-limit');
=======
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
require('dotenv').config();

const app = express();

<<<<<<< HEAD
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
=======
// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)

// Routes
const authRoutes = require('./routes/authRoutes');
const financeRoutes = require('./routes/financeRoutes');
const hrRoutes = require('./routes/hrRoutes');
const operationsRoutes = require('./routes/operationsRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const leanRoutes = require('./routes/leanRoutes');
const executiveRoutes = require('./routes/executiveRoutes');
<<<<<<< HEAD
const incidentsRoutes = require('./routes/incidentsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// API routes
=======

>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/lean', leanRoutes);
app.use('/api/executive', executiveRoutes);
<<<<<<< HEAD
app.use('/api/incidents', incidentsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    demoMode: process.env.DEMO_MODE === 'true'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NEXUS360 API',
    version: '2.0.0',
    status: 'operational',
    features: ['Power BI Integration', 'RLS', 'Incident Reporting', 'Photo Uploads']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 NEXUS360 API v2.0 running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Demo Mode: ${process.env.DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📈 Power BI Integration: READY`);
});
=======

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.get('/', (req, res) => {
  res.json({ name: 'NEXUS360 API', version: '1.0.0', status: 'operational' });
});

app.use((req, res) => res.status(404).json({ success: false, error: 'Endpoint not found' }));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NEXUS360 API running on port ${PORT}`));
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)

module.exports = app;
