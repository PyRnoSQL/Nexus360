import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OperationsPage from './pages/OperationsPage';
import LogisticsPage from './pages/LogisticsPage';
import HRPage from './pages/HRPage';
import FinancePage from './pages/FinancePage';
import TrainingPage from './pages/TrainingPage';
import IncidentsPage from './pages/IncidentsPage';
import PredictiveIntelligencePage from './pages/PredictiveIntelligencePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DashboardLayout from './components/Layout/DashboardLayout';

const ProtectedRoute = ({ children, requiredModule }) => {
  const { isAuthenticated, loading, user, hasModuleAccess } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredModule && !hasModuleAccess(requiredModule)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/operations" element={
        <ProtectedRoute requiredModule="operations">
          <DashboardLayout>
            <OperationsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/logistics" element={
        <ProtectedRoute requiredModule="logistics">
          <DashboardLayout>
            <LogisticsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/hr" element={
        <ProtectedRoute requiredModule="hr">
          <DashboardLayout>
            <HRPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/finance" element={
        <ProtectedRoute requiredModule="finance">
          <DashboardLayout>
            <FinancePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/training" element={
        <ProtectedRoute requiredModule="training">
          <DashboardLayout>
            <TrainingPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/incidents" element={
        <ProtectedRoute requiredModule="incidents">
          <DashboardLayout>
            <IncidentsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/predictive" element={
        <ProtectedRoute requiredModule="operations">
          <DashboardLayout>
            <PredictiveIntelligencePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
