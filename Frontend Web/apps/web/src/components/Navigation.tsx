import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRBAC } from '../hooks/useRBAC';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Wallet, Users, Shield, Truck, 
  GraduationCap, TrendingUp, FileText, LogOut, 
  Activity, User, ShieldCheck 
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { canAccessForms, canAccessDashboard, role } = useRBAC();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/welcome', label: t('common.welcome'), icon: Activity },
    { path: '/executive', label: t('nav.executive'), icon: LayoutDashboard },
    { path: '/finance', label: t('nav.finance'), icon: Wallet },
    { path: '/rh', label: t('nav.rh'), icon: Users },
    { path: '/operations', label: t('nav.operations'), icon: Shield },
    { path: '/logistique', label: t('nav.logistique'), icon: Truck },
    { path: '/formation', label: t('nav.formation'), icon: GraduationCap },
    { path: '/lean', label: t('nav.lean'), icon: TrendingUp },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-navy-900 border-r border-navy-700 flex flex-col">
      <div className="p-6 border-b border-navy-700">
        <h1 className="text-xl font-bold text-gold-500">NEXUS360</h1>
        <p className="text-xs text-gray-500 mt-1">DGSN Cameroun</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            if (!canAccessDashboard(item.path.replace('/', ''))) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {canAccessForms && (
            <Link
              to="/forms"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/forms'
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                  : 'text-gray-400 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">{t('nav.forms')}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-navy-700 space-y-3">
        <LanguageSwitcher />
        {user && (
          <div className="space-y-2">
            <div className="px-3 py-2 bg-navy-800 rounded-lg">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{t('common.logout')}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
