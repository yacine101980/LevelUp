import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function GoalForm({ goal, onSave, onCancel }) {
  // Initialisation des états avec les valeurs par défaut
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [category, setCategory] = useState(goal?.category || 'personal');
  
  // Date par défaut : Aujourd'hui + 30 jours
  const [deadline, setDeadline] = useState(
    goal?.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  const [steps, setSteps] = useState(goal?.steps || []);
  const [newStepTitle, setNewStepTitle] = useState('');

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      setSteps([
        ...steps,
        {
          id: Date.now().toString(),
          title: newStepTitle,
          completed: false,
        },
      ]);
      setNewStepTitle('');
    }
  };

  const handleRemoveStep = (stepId) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      id: goal?.id || Date.now().toString(),
      title,
      description,
      category,
      deadline,
      steps,
      createdAt: goal?.createdAt || new Date().toISOString(),
      completedAt: goal?.completedAt,
    };
    onSave(newGoal);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        
        {/* Header Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {goal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'objectif *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Ex: Apprendre le piano"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="Décrivez votre objectif..."
            />
          </div>

          {/* Category and Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="personal">Personnel</option>
                <option value="professional">Professionnel</option>
                <option value="health">Santé</option>
                <option value="learning">Apprentissage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Steps Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Étapes
            </label>
            <div className="space-y-2 mb-3">
              {steps.map(step => (
                <div key={step.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm text-gray-900">{step.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {steps.length === 0 && (
                 <p className="text-sm text-gray-500 italic text-center py-2">Ajoutez des étapes pour découper votre objectif.</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newStepTitle}
                onChange={e => setNewStepTitle(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddStep())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Nouvelle étape..."
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {goal ? 'Enregistrer' : 'Créer l\'objectif'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}