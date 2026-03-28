<<<<<<< HEAD
const SheetsService = require('../services/googleSheetsService');
const { hashPassword, verifyPassword, generateToken, ROLES } = require('../config/auth');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class AuthController {
  // User login with role-based access
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'User ID and Password are required'
        });
      }

      // Demo mode login
      if (process.env.DEMO_MODE === 'true') {
        const demoUsers = {
          'admin': { id: 1, username: 'admin', full_name: 'Director General', role: ROLES.SUPER_ADMIN, department: 'Administration', email: 'admin@dgsn.cm' },
          'commander': { id: 2, username: 'commander', full_name: 'Commissaire Divisionnaire', role: ROLES.COMMANDER, department: 'Operations', email: 'commander@dgsn.cm' },
          'ops_officer': { id: 3, username: 'ops_officer', full_name: 'Officier de Police', role: ROLES.OPERATIONS_OFFICER, department: 'Operations', email: 'ops@dgsn.cm' },
          'hr_officer': { id: 4, username: 'hr_officer', full_name: 'Officier RH', role: ROLES.HR_OFFICER, department: 'HR', email: 'hr@dgsn.cm' }
        };

        const user = demoUsers[username.toLowerCase()];
        if (user && (password === 'demo123' || password === user.username)) {
          const token = generateToken(user);
          return res.json({
            success: true,
            data: { token, user }
          });
        }
        
        // Fallback demo user
        const demoUser = { id: 1, username: 'demo', full_name: 'Demo User', role: ROLES.SUPER_ADMIN, department: 'Demo', email: 'demo@nexus360.cm' };
        const token = generateToken(demoUser);
        return res.json({
          success: true,
          data: { token, user: demoUser }
        });
      }

      if (!isSheetsReady()) {
        return res.status(503).json({
          success: false,
          error: 'System configuration error. Please contact administrator.'
        });
      }

      const users = await SheetsService.getData(SHEETS.USERS);
      const user = users.find(u => u.username === username);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid User ID or Password' });
      }

      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid User ID or Password' });
      }

      if (user.is_active === 'false') {
        return res.status(403).json({ success: false, error: 'Account disabled. Contact administrator.' });
      }

      const token = generateToken({
        id: user.user_id,
        username: user.username,
        role: user.role,
        department: user.department
      });

      SheetsService.updateCell(SHEETS.USERS, `G${parseInt(user.user_id) + 1}`, new Date().toISOString()).catch(console.error);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            email: user.email
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
    }
  }

  // Get current user profile with permissions
  static async getProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      if (process.env.DEMO_MODE === 'true') {
        return res.json({
          success: true,
          data: {
            id: req.user.id,
            username: req.user.username,
            full_name: req.user.full_name || 'Demo User',
            role: req.user.role,
            department: req.user.department,
            email: req.user.email,
            permissions: req.user.permissions
          }
        });
      }

      const users = await SheetsService.getData(SHEETS.USERS);
      const user = users.find(u => u.user_id == req.user.id);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.json({
        success: true,
        data: {
          id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          email: user.email,
          permissions: req.user.permissions
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, error: 'Failed to load profile' });
    }
  }

  // Get user permissions
  static async getPermissions(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      res.json({
        success: true,
        data: {
          role: req.user.role,
          permissions: req.user.permissions,
          department: req.user.department
        }
      });
    } catch (error) {
      console.error('Get permissions error:', error);
      res.status(500).json({ success: false, error: 'Failed to get permissions' });
    }
  }
}

=======
const SheetsService = require('../services/sheetsService');
const { hashPassword, verifyPassword, generateToken } = require('../config/auth');
const { SHEETS, isSheetsReady } = require('../config/googleSheets');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password required' });
      
      if (process.env.DEMO_MODE === 'true' && username === 'demo') {
        const demoUser = { id: 1, username: 'demo_user', full_name: 'Demo User', role: 'super_admin', email: 'demo@nexus360.cm' };
        return res.json({ success: true, data: { token: generateToken(demoUser), user: demoUser } });
      }
      
      if (!isSheetsReady()) return res.status(503).json({ success: false, error: 'System configuration error' });
      
      const users = await SheetsService.getData(SHEETS.USERS);
      const user = users.find(u => u.username === username);
      if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      
      if (user.is_active === 'false') return res.status(403).json({ success: false, error: 'Account disabled' });
      
      const token = generateToken({ id: user.user_id, username: user.username, role: user.role });
      SheetsService.updateCell(SHEETS.USERS, `G${parseInt(user.user_id) + 1}`, new Date().toISOString()).catch(console.error);
      
      res.json({ success: true, data: { token, user: { id: user.user_id, username: user.username, full_name: user.full_name, role: user.role, email: user.email } } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  }

  static async getProfile(req, res) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
      if (process.env.DEMO_MODE === 'true') return res.json({ success: true, data: { id: req.user.id, username: req.user.username, full_name: 'Demo User', role: req.user.role, email: 'demo@nexus360.cm' } });
      
      const users = await SheetsService.getData(SHEETS.USERS);
      const user = users.find(u => u.user_id == req.user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data: { id: user.user_id, username: user.username, full_name: user.full_name, role: user.role, email: user.email } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load profile' });
    }
  }
}
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
module.exports = AuthController;
