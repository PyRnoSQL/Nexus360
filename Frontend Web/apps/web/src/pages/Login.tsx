import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Building, MapPin, User, Lock } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(username, password);
    if (success) {
      toast.success('Connexion réussie');
      navigate('/welcome');
    } else {
      toast.error('Identifiants invalides');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gold-500/10 rounded-full">
              <Shield className="w-12 h-12 text-gold-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NEXUS360</h1>
          <p className="text-gold-500 font-medium">Plateforme Nationale d'Intelligence Opérationnelle</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Building className="w-4 h-4" />
            <span>Délégation Générale à la Sûreté Nationale</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" />
            <span>Cameroun</span>
          </div>
        </div>

        <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl border border-navy-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom d'utilisateur</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white focus:border-gold-500"
                  placeholder="dg / cd / op / admin"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white focus:border-gold-500"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-700">
            <p className="text-xs text-center text-gray-500 mb-3">Accès de démonstration</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-navy-900/50 rounded p-2 text-center"><span className="text-gold-500">DG:</span> dg / 1234</div>
              <div className="bg-navy-900/50 rounded p-2 text-center"><span className="text-gold-500">Officier:</span> op / 1234</div>
              <div className="bg-navy-900/50 rounded p-2 text-center"><span className="text-gold-500">Admin:</span> admin / 1234</div>
              <div className="bg-navy-900/50 rounded p-2 text-center"><span className="text-gold-500">Commissaire:</span> cd / 1234</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-600">© 2024 Délégation Générale à la Sûreté Nationale du Cameroun</p>
        </div>
      </div>
    </div>
  );
};
