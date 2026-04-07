import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, Activity, Users, Truck, GraduationCap, TrendingUp, Wallet } from 'lucide-react';

export const Welcome: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = [
    { icon: FileText, label: 'Formulaires soumis', value: '0', color: 'text-blue-500' },
    { icon: Activity, label: 'Incidents actifs', value: '0', color: 'text-red-500' },
    { icon: Users, label: 'Officiers', value: '0', color: 'text-green-500' },
    { icon: Truck, label: 'Véhicules', value: '0', color: 'text-yellow-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {t('welcome.greeting', { name: user?.name })}
        </h1>
        <p className="text-gray-400 mt-1">
          {t('welcome.role', { role: user?.role })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-gray-400">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Modules disponibles</h2>
          <div className="space-y-3">
            {[
              { icon: Shield, name: 'Direction Générale', desc: 'Tableaux de bord stratégiques' },
              { icon: Wallet, name: 'Finances & Budget', desc: 'Suivi budgétaire' },
              { icon: Users, name: 'Ressources Humaines', desc: 'Gestion du personnel' },
              { icon: Activity, name: 'Opérations', desc: 'Gestion des incidents' },
              { icon: Truck, name: 'Logistique', desc: 'Gestion du parc' },
              { icon: GraduationCap, name: 'Formation', desc: 'Programmes de formation' },
              { icon: TrendingUp, name: 'LEAN', desc: 'Performance' },
            ].map((module, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-navy-800 rounded-lg">
                <module.icon className="w-5 h-5 text-gold-500" />
                <div>
                  <p className="text-white font-medium">{module.name}</p>
                  <p className="text-xs text-gray-500">{module.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Accès rapide</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-navy-800 rounded-lg hover:bg-navy-700 transition-colors">
              <p className="text-white font-medium">📝 Nouveau formulaire</p>
              <p className="text-xs text-gray-500">Remplir un rapport opérationnel</p>
            </button>
            <button className="w-full text-left p-3 bg-navy-800 rounded-lg hover:bg-navy-700 transition-colors">
              <p className="text-white font-medium">📊 Voir les tableaux de bord</p>
              <p className="text-xs text-gray-500">Analyser les indicateurs</p>
            </button>
            <button className="w-full text-left p-3 bg-navy-800 rounded-lg hover:bg-navy-700 transition-colors">
              <p className="text-white font-medium">🔄 Synchroniser les données</p>
              <p className="text-xs text-gray-500">Mettre à jour les informations</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
