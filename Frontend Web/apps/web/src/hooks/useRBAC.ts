import { useAuth } from '../contexts/AuthContext';

export type UserRole = 'DG' | 'COMMISSAIRE' | 'OFFICIER' | 'SUPER_ADMIN';

export const useRBAC = () => {
  const { user } = useAuth();
  const role = user?.role as UserRole;

  const canAccessForms = () => {
    return role === 'OFFICIER' || role === 'SUPER_ADMIN';
  };

  const canEditForms = () => {
    return role === 'OFFICIER' || role === 'SUPER_ADMIN';
  };

  const canDeleteForms = () => {
    return role === 'SUPER_ADMIN';
  };

  const canAccessDashboard = (dashboardName: string) => {
    if (role === 'SUPER_ADMIN') return true;
    if (role === 'DG') return true;
    if (role === 'COMMISSAIRE' && ['operations', 'logistique', 'formation'].includes(dashboardName)) return true;
    return false;
  };

  return {
    role,
    canAccessForms: canAccessForms(),
    canEditForms: canEditForms(),
    canDeleteForms: canDeleteForms(),
    canAccessDashboard,
  };
};
