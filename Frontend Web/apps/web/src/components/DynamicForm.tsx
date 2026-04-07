import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'file';
  required?: boolean;
  options?: string[];
}

interface DynamicFormProps {
  module: string;
  formType: string;
  onSubmit: (data: any) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const DynamicForm: React.FC<DynamicFormProps> = ({ module, formType, onSubmit }) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, string[]>>({});

  const formSchemas: Record<string, FormField[]> = {
    operations: [
      { name: 'incident_date', label: "Date de l'incident", type: 'date', required: true },
      { name: 'incident_type', label: "Type d'incident", type: 'select', required: true },
      { name: 'city', label: 'Ville', type: 'select', required: true },
      { name: 'region', label: 'Région', type: 'select', required: true },
      { name: 'priority', label: 'Priorité', type: 'select', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'reported_by', label: 'Signalé par', type: 'text', required: true },
      { name: 'incident_photo', label: 'Photo de la scène', type: 'file', required: false },
    ],
    finance: [
      { name: 'transaction_date', label: 'Date de transaction', type: 'date', required: true },
      { name: 'budget_line', label: 'Ligne budgétaire', type: 'select', required: true },
      { name: 'amount', label: 'Montant (FCFA)', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
    hr: [
      { name: 'employee_name', label: 'Nom complet', type: 'text', required: true },
      { name: 'department', label: 'Département', type: 'select', required: true },
      { name: 'position', label: 'Poste', type: 'select', required: true },
      { name: 'hire_date', label: "Date d'embauche", type: 'date', required: true },
    ],
    logistique: [
      { name: 'vehicle_type', label: 'Type de véhicule', type: 'select', required: true },
      { name: 'license_plate', label: "Plaque d'immatriculation", type: 'text', required: true },
      { name: 'status', label: 'Statut', type: 'select', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
    formation: [
      { name: 'program_name', label: 'Nom du programme', type: 'text', required: true },
      { name: 'category', label: 'Catégorie', type: 'select', required: true },
      { name: 'start_date', label: 'Date de début', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    lean: [
      { name: 'process_name', label: 'Nom du processus', type: 'text', required: true },
      { name: 'process_type', label: 'Type de processus', type: 'select', required: true },
      { name: 'impact_level', label: "Niveau d'impact", type: 'select', required: true },
      { name: 'improvement_actions', label: "Actions d'amélioration", type: 'textarea', required: true },
    ],
  };

  useEffect(() => {
    loadDynamicOptions();
    const schema = formSchemas[module];
    if (schema) {
      setFields(schema);
      const initialData: Record<string, any> = {};
      schema.forEach(field => {
        if (field.type !== 'file') initialData[field.name] = '';
      });
      setFormData(initialData);
    }
  }, [module]);

  const loadDynamicOptions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/forms/options/${module}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDynamicOptions(data.options);
      }
    } catch (error) {
      // Fallback options
      setDynamicOptions({
        incidentTypes: ['Vol', 'Agression', 'Cambriolage', 'Homicide', 'Accident'],
        cities: ['Yaoundé', 'Douala', 'Garoua', 'Bafoussam', 'Bamenda'],
        regions: ['Centre', 'Littoral', 'Nord', 'Ouest', 'Sud'],
        priorities: ['Haute', 'Moyenne', 'Basse'],
        budgetLines: ['Sécurité', 'Équipement', 'Formation', 'Transport'],
        departments: ['Opérations', 'Renseignement', 'Logistique', 'Administration'],
        positions: ['Officier', 'Commissaire', 'Inspecteur', 'Agent'],
        vehicleTypes: ['Berline', '4x4', 'Camion', 'Moto'],
        statuses: ['En service', 'Maintenance', 'Hors service'],
        categories: ['Sécurité', 'Informatique', 'Management'],
        processTypes: ['Administratif', 'Opérationnel', 'Logistique'],
        impactLevels: ['Faible', 'Moyen', 'Élevé'],
      });
    }
  };

  const handleFileChange = async (fieldName: string, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Le fichier ne doit pas dépasser 10MB');
      return;
    }
    
    const preview = URL.createObjectURL(file);
    setFiles(prev => ({ ...prev, [fieldName]: file }));
    setFilePreviews(prev => ({ ...prev, [fieldName]: preview }));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const uploadedUrls: Record<string, any> = {};
      for (const [fieldName, file] of Object.entries(files)) {
        uploadedUrls[fieldName] = await uploadFile(file);
      }
      
      await onSubmit({ formType, module, formData: { ...formData, ...uploadedUrls } });
      setFormData({});
      setFiles({});
      Object.values(filePreviews).forEach(URL.revokeObjectURL);
      setFilePreviews({});
      toast.success('Formulaire soumis avec succès');
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const options = dynamicOptions[field.name] || field.options;
          
          if (field.type === 'file') {
            return (
              <div key={field.name} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                <div className="border-2 border-dashed border-navy-600 rounded-lg p-6 text-center">
                  {filePreviews[field.name] ? (
                    <div className="relative inline-block">
                      <img src={filePreviews[field.name]} alt="Preview" className="max-h-48 rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setFiles(prev => { const newFiles = { ...prev }; delete newFiles[field.name]; return newFiles; });
                          setFilePreviews(prev => { const newPreviews = { ...prev }; delete newPreviews[field.name]; return newPreviews; });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">PNG, JPEG, WEBP jusqu'à 10MB</p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(field.name, e.target.files[0])}
                        className="hidden"
                        id={field.name}
                      />
                      <label htmlFor={field.name} className="inline-block mt-3 px-4 py-2 bg-navy-700 rounded-lg cursor-pointer text-sm">
                        Sélectionner
                      </label>
                    </>
                  )}
                </div>
              </div>
            );
          }
          
          return (
            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  required={field.required}
                  className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:border-gold-500"
                >
                  <option value="">Sélectionnez...</option>
                  {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  required={field.required}
                  rows={4}
                  className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:border-gold-500"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  required={field.required}
                  className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:border-gold-500"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold rounded-lg disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Soumettre le formulaire'}
      </button>
    </form>
  );
};
