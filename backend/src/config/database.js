// Database configuration placeholder
// This file is for future database integration (PostgreSQL/MySQL)

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nexus360',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Check if database is configured
const isDbConfigured = () => {
  return !!(process.env.DB_HOST && process.env.DB_NAME);
};

// Get database connection (placeholder)
const getConnection = () => {
  if (!isDbConfigured()) {
    return null;
  }
  // In production, initialize Sequelize or Knex here
  return { config: DB_CONFIG, connected: false };
};

module.exports = {
  DB_CONFIG,
  isDbConfigured,
  getConnection
};
