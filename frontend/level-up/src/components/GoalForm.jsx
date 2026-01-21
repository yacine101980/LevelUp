import React, { useState, useEffect} from 'react';
import { X, Plus, Trash2, Edit2, CheckCircle2, Save } from 'lucide-react';

export default function GoalForm({ goal, onSave, onCancel }) {
  // Initialisation des états avec les valeurs par défaut
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [category, setCategory] = useState(goal?.category || 'personal');
  const [editingStepId, setEditingStepId] = useState(null);

  // Date par défaut : Aujourd'hui + 30 jours
  const [deadline, setDeadline] = useState('');
  
  const [steps, setSteps] = useState([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDeadline, setNewStepDeadline] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setCategory(goal.category || 'personal');
      setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
      setSteps((goal.steps || []).map(step => ({
        ...step,
        completed: step.is_completed || step.completed || false,
        is_completed: undefined // Nettoyer pour éviter la confusion
        })));
    } else {
      // Pour un nouvel objectif
      setTitle('');
      setDescription('');
      setCategory('personal');
      setDeadline(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setSteps([]);
    }
  }, [goal]);

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      setSteps([
        ...steps,
        {
          id: Date.now().toString(),
          title: newStepTitle.trim(),
          deadline: newStepDeadline || null,
          completed: false,
        },
      ]);
      setNewStepTitle('');
      setNewStepDeadline('');
    }
  };

  const handleEditStep = (stepId, field, value) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, [field]: value } : s));
  };

  const handleCompleteStep = (stepId) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s));
  };

  const startEditingStep = (stepId) => {
    setEditingStepId(stepId);
  };

  const stopEditingStep = () => {
    setEditingStepId(null);
  };

  const handleRemoveStep = (stepId) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    const newGoal = {
      id: goal?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      deadline,
      steps,
      createdAt: goal?.createdAt || new Date().toISOString(),
      completedAt: goal?.completedAt || null,
    };
    onSave(newGoal);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStep();
    }
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
            type="button"
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
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Étapes</h4>
            
            {/* Input pour nouvelle étape */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStepTitle}
                onChange={e => setNewStepTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Titre de l'étape..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <input
                type="date"
                value={newStepDeadline}
                onChange={e => setNewStepDeadline(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Date"
              />
              <button
                type="button"
                onClick={handleAddStep}
                disabled={!newStepTitle.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Ajouter l'étape"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Liste des étapes */}
            {steps.length > 0 && (
              <div className="space-y-2">
                {steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {editingStepId === step.id ? (
                      // Mode édition
                      <>
                        <input
                          type="text"
                          value={step.title}
                          onChange={e => handleEditStep(step.id, 'title', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Titre de l'étape"
                        />
                        <input
                          type="date"
                          value={step.deadline ? step.deadline.split('T')[0] : ''}
                          onChange={e => handleEditStep(step.id, 'deadline', e.target.value)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={stopEditingStep}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Sauvegarder"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      // Mode lecture
                      <>
                        <button
                          type="button"
                          onClick={() => handleCompleteStep(step.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            step.completed 
                              ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={step.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <span className={`flex-1 text-sm ${
                          step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </span>
                        {step.deadline && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {new Date(step.deadline).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => startEditingStep(step.id)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(step.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {steps.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">
                Aucune étape ajoutée. Ajoutez des étapes pour suivre votre progression.
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg shadow-indigo-500/30"
            >
              {goal ? 'Enregistrer' : 'Créer l\'objectif'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}