import React from 'react';
import { CheckCircle2, Calendar, Edit2, Trash2, Trophy } from 'lucide-react';

// Pas besoin d'importer les types en JS

const categoryColors = {
  personal: 'bg-blue-100 text-blue-700',
  professional: 'bg-purple-100 text-purple-700',
  health: 'bg-green-100 text-green-700',
  learning: 'bg-orange-100 text-orange-700',
};

const categoryLabels = {
  personal: 'Personnel',
  professional: 'Professionnel',
  health: 'Santé',
  learning: 'Apprentissage',
};

export default function GoalCard({ goal, onEdit, onDelete, onToggleStep,onComplete, onAbandon }) {
  // Sécurités au cas où goal.steps soit undefined
  const steps = goal.steps || [];
  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const deadline = new Date(goal.deadline);
  // Calcul du nombre de jours restants
  const daysRemaining = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white rounded-xl p-6 border-2 shadow-sm transition-all hover:shadow-md ${
      goal.status === 'completed'? 'border-green-200 bg-green-50/30' :goal.status === 'abandoned' ?'border-red-200 bg-red-50/30' : 'border-gray-200'
       
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* Badge Catégorie */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[goal.category] || 'bg-gray-100 text-gray-700'}`}>
              {categoryLabels[goal.category] || goal.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {goal.priority === 'high' ? 'Haute' : goal.priority === 'low' ? 'Basse' : 'Moyenne'}
            </span>
            {/* Badge Terminé */}
            {goal.status==='completed' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Trophy className="w-3 h-3" />
                Terminé
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 ml-4">
          {goal.status!=='completed' && goal.status!=='abandoned' && (
          <button
            onClick={() => onComplete(goal.id)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Terminer
          </button>
        )}
         {goal.status !== 'abandoned' && (
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression</span>
          <span className="text-sm font-semibold text-gray-900">
            {completedSteps} / {totalSteps} étapes
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              goal.completedAt ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Deadline */}
      {!goal.completedAt && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            {daysRemaining > 0 ? (
              <span className={daysRemaining <= 7 ? 'text-orange-600 font-medium' : ''}>
                {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-red-600 font-medium">Échéance dépassée</span>
            )}
          </span>
        </div>
      )}

     
    {goal.status !== 'abandoned' && goal.status !== 'completed' && (
              <button
                onClick={() => onAbandon(goal.id)}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Abandonner
              </button>
            )}
    </div>
  );
}