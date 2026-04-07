import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tableau de bord - Direction Générale</h1>
        <p className="text-gray-400 mt-1">Indicateurs stratégiques et performance globale</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">KPIs Stratégiques</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Taux de résolution des incidents</span>
              <span className="text-2xl font-bold text-gold-500">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Satisfaction citoyenne</span>
              <span className="text-2xl font-bold text-gold-500">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Temps de réponse moyen</span>
              <span className="text-2xl font-bold text-gold-500">12min</span>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Looker Studio</h2>
          <div className="aspect-video bg-navy-900 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Dashboard Looker Studio intégré</p>
          </div>
        </div>
      </div>
    </div>
  );
};
