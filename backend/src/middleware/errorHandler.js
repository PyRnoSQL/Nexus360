const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  const response = { success: false, error: 'Internal server error', timestamp: new Date().toISOString() };
  if (err.name === 'ValidationError') return res.status(400).json({ ...response, error: 'Validation error', details: err.message });
  if (err.name === 'UnauthorizedError') return res.status(401).json({ ...response, error: 'Unauthorized access' });
  if (err.code === 'ECONNREFUSED') return res.status(503).json({ ...response, error: 'Database connection failed' });
  if (process.env.NODE_ENV === 'development') response.stack = err.stack;
  res.status(err.status || 500).json(response);
};
module.exports = errorHandler;
