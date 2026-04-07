import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useRBAC } from './hooks/useRBAC';
import { Navigation } from './components/Navigation';
import { Login } from './pages/Login';
import { Welcome } from './pages/Welcome';
import { Forms } from './pages/Forms';
import { ExecutiveDashboard } from './pages/dashboards/ExecutiveDashboard';
import { FinanceDashboard } from './pages/dashboards/FinanceDashboard';
import { RHDashboard } from './pages/dashboards/RHDashboard';
import { OperationsDashboard } from './pages/dashboards/OperationsDashboard';
import { LogistiqueDashboard } from './pages/dashboards/LogistiqueDashboard';
import { FormationDashboard } from './pages/dashboards/FormationDashboard';
import { LeanDashboard } from './pages/dashboards/LeanDashboard';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-navy-950">
      <Navigation />
      <main className="ml-64">{children}</main>
    </div>
  );
};

const ProtectedFormsRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canAccessForms } = useRBAC();
  if (!canAccessForms) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/welcome" element={<ProtectedLayout><Welcome /></ProtectedLayout>} />
      <Route path="/forms" element={<ProtectedLayout><ProtectedFormsRoute><Forms /></ProtectedFormsRoute></ProtectedLayout>} />
      <Route path="/executive" element={<ProtectedLayout><ExecutiveDashboard /></ProtectedLayout>} />
      <Route path="/finance" element={<ProtectedLayout><FinanceDashboard /></ProtectedLayout>} />
      <Route path="/rh" element={<ProtectedLayout><RHDashboard /></ProtectedLayout>} />
      <Route path="/operations" element={<ProtectedLayout><OperationsDashboard /></ProtectedLayout>} />
      <Route path="/logistique" element={<ProtectedLayout><LogistiqueDashboard /></ProtectedLayout>} />
      <Route path="/formation" element={<ProtectedLayout><FormationDashboard /></ProtectedLayout>} />
      <Route path="/lean" element={<ProtectedLayout><LeanDashboard /></ProtectedLayout>} />
    </Routes>
  );
}

export default App;
