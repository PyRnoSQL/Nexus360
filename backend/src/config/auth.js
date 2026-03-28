const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'nexus360-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const SALT_ROUNDS = 12;

// User roles with hierarchical permissions
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMMANDER: 'commander',
  OPERATIONS_OFFICER: 'operations_officer',
  HR_OFFICER: 'hr_officer'
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['all'],
  [ROLES.COMMANDER]: ['operations', 'logistics', 'dashboard'],
  [ROLES.OPERATIONS_OFFICER]: ['operations.read', 'incidents.create', 'incidents.update'],
  [ROLES.HR_OFFICER]: ['hr.read', 'hr.update']
};

const hashPassword = async (password) => {
  if (!password) throw new Error('Password is required');
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  if (!user || !user.id || !user.username) {
    throw new Error('Invalid user data for token generation');
  }
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role || 'viewer',
      department: user.department,
      permissions: ROLE_PERMISSIONS[user.role] || []
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const hasPermission = (user, requiredPermission) => {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;
  return user.permissions?.includes(requiredPermission) || user.permissions?.includes('all');
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  hasPermission,
  ROLES,
  ROLE_PERMISSIONS,
  JWT_SECRET,
  SALT_ROUNDS
};
