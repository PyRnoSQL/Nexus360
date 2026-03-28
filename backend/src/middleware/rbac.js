const { hasPermission, ROLES } = require('../config/auth');

// Role-based access control middleware
const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (hasPermission(req.user, requiredPermission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied. Insufficient permissions.',
      required: requiredPermission,
      user_role: req.user.role
    });
  };
};

// Department-based access control
const requireDepartment = (allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (allowedDepartments.includes(req.user.department)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied. This resource is restricted to your department.',
      allowed_departments: allowedDepartments
    });
  };
};

// Module access control
const moduleAccess = {
  operations: ['super_admin', 'commander', 'operations_officer'],
  logistics: ['super_admin', 'commander'],
  hr: ['super_admin', 'hr_officer'],
  finance: ['super_admin'],
  training: ['super_admin', 'commander'],
  lean: ['super_admin', 'commander'],
  incidents: ['super_admin', 'commander', 'operations_officer'],
  dashboard: ['super_admin', 'commander', 'operations_officer', 'hr_officer']
};

const requireModuleAccess = (moduleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const allowedRoles = moduleAccess[moduleName] || [];
    if (allowedRoles.includes(req.user.role) || req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Access denied. You don't have permission to access the ${moduleName} module.`
    });
  };
};

module.exports = {
  requirePermission,
  requireDepartment,
  requireModuleAccess,
  moduleAccess
};
