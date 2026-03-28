import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Role-based module access mapping
const ROLE_MODULE_ACCESS = {
  super_admin: ['dashboard', 'finance', 'hr', 'training', 'logistics', 'operations', 'incidents', 'predictive'],
  commander: ['dashboard', 'logistics', 'operations', 'incidents', 'predictive'],
  operations_officer: ['dashboard', 'operations', 'incidents'],
  hr_officer: ['dashboard', 'hr']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then(res => {
          setUser(res.data.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasModuleAccess = (module) => {
    if (!user) return false;
    const allowedModules = ROLE_MODULE_ACCESS[user.role] || [];
    return allowedModules.includes(module);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      hasModuleAccess,
      hasPermission,
      role: user?.role,
      department: user?.department
    }}>
      {children}
    </AuthContext.Provider>
  );
};
