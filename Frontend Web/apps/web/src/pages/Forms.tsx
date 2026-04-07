import React, { useState } from 'react';
import { useRBAC } from '../hooks/useRBAC';
import { DynamicForm } from '../components/DynamicForm';
import { FileText, AlertCircle, User, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MODULES = [
  { id: 'operations', name: 'Opérations & Sécurité', icon: '🛡️', description: 'Gestion des incidents et opérations de sécurité' },
  { id: 'finance', name: 'Finances & Budget', icon: '💰', description: 'Transactions financières et suivi budgétaire' },
  { id: 'hr', name: 'Ressources Humaines', icon: '👥', description: 'Gestion du personnel et carrières' },
  { id: 'logistique', name: 'Logistique & Parc', icon: '🚗', description: 'Gestion des véhicules et équipements' },
  { id: 'formation', name: 'Formation', icon: '📚', description: 'Programmes de formation et développement' },
  { id: 'lean', name: 'LEAN & Performance', icon: '📊', description: 'Amélioration continue et performance' },
];

export const Forms: React.FC = () => {
  const { role, canAccessForms } = useRBAC();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  if (!canAccessForms) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-3">Accès restreint</h2>
          <p className="text-gray-400">Seuls les Officiers et Super Administrateurs peuvent accéder aux formulaires.</p>
          <div className="mt-6 flex justify-center gap-4">
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

  const handleSubmit = async (data: any) => {
    const response = await fetch(`${API_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Submission failed');
    setSelectedModule(null);
  };

  if (selectedModule) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={() => setSelectedModule(null)} className="mb-4 text-gold-500 hover:text-gold-400">
          ← Retour aux modules
        </button>
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">{MODULES.find(m => m.id === selectedModule)?.name}</h2>
          <DynamicForm module={selectedModule} formType={`${selectedModule}_form`} onSubmit={handleSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Formulaires opérationnels DGSN</h1>
        <p className="text-gray-400 mt-1">Sélectionnez un module pour remplir un formulaire</p>
        {role === 'OFFICIER' && (
          <div className="flex items-center gap-2 mt-2 text-gold-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Vous avez accès à tous les formulaires</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module.id)}
            className="glass rounded-xl p-6 text-left hover:border-gold-500/30 transition-all group"
          >
            <div className="text-3xl mb-3">{module.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-500">{module.name}</h3>
            <p className="text-gray-400 text-sm">{module.description}</p>
            <div className="mt-4 text-gold-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Remplir le formulaire →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
