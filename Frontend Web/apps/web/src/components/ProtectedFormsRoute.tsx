import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, User, Shield } from 'lucide-react';

export const ProtectedFormsRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canAccessForms } = useRBAC();
  const { t } = useTranslation();

  if (!canAccessForms) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-800 rounded-xl p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">{t('forms.noAccess')}</h1>
          <p className="text-gray-400 mb-6">{t('forms.noAccessMessage')}</p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-navy-700 rounded-full">
              <User className="w-4 h-4 text-gold-500" />
              <span className="text-sm">Officiers</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-navy-700 rounded-full">
              <Shield className="w-4 h-4 text-gold-500" />
              <span className="text-sm">Super Admins</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
