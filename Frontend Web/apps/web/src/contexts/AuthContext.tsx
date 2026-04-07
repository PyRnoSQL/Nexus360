import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'DG' | 'COMMISSAIRE' | 'OFFICIER' | 'SUPER_ADMIN';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      // Demo fallback
      const DEMO_USERS = {
        dg: { id: '1', username: 'dg', role: 'DG', name: 'Délégué Général' },
        cd: { id: '2', username: 'cd', role: 'COMMISSAIRE', name: 'Commissaire Divisionnaire' },
        op: { id: '3', username: 'op', role: 'OFFICIER', name: 'Officier de Police' },
        admin: { id: '4', username: 'admin', role: 'SUPER_ADMIN', name: 'Super Administrateur' }
      };
      
      const demoUser = DEMO_USERS[username.toLowerCase()];
      if (demoUser && password === '1234') {
        const fakeToken = btoa(JSON.stringify(demoUser));
        setToken(fakeToken);
        setUser(demoUser);
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
