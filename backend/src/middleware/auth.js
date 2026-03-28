const { verifyToken } = require('../config/auth');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: `Insufficient permissions. Required: ${roles.join(', ')}` });
  next();
};

const demoMode = (req, res, next) => {
  if (process.env.DEMO_MODE === 'true') {
    req.user = { id: 1, username: 'demo_user', role: 'super_admin' };
    return next();
  }
  return authenticate(req, res, next);
};

module.exports = { authenticate, authorize, demoMode };
