import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const DEMO_USERS = {
  dg: { id: '1', username: 'dg', password: '1234', role: 'DG', name: 'Délégué Général' },
  cd: { id: '2', username: 'cd', password: '1234', role: 'COMMISSAIRE', name: 'Commissaire Divisionnaire' },
  op: { id: '3', username: 'op', password: '1234', role: 'OFFICIER', name: 'Officier de Police' },
  admin: { id: '4', username: 'admin', password: '1234', role: 'SUPER_ADMIN', name: 'Super Administrateur' }
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = DEMO_USERS[username.toLowerCase()];
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, role: user.role, name: user.name }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

router.post('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

export default router;
