import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Filter } from 'lucide-react';
import GoalCard from '../components/GoalCard'; // J'ai corrigé l'import
import GoalForm from '../components/GoalForm'; // J'ai corrigé l'import

export default function Goals() {
  const [goals, setGoals] = useLocalStorage('goals', []);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.completedAt;
    if (filter === 'completed') return goal.completedAt;
    return true;
  });

  const handleSaveGoal = (goal) => {
    if (editingGoal) {
      setGoals(goals.map(g => (g.id === goal.id ? goal : g)));
    } else {
      setGoals([...goals, goal]);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleToggleStep = (goalId, stepId) => {
    setGoals(
      goals.map(goal => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map(step =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );
          // Vérifier si toutes les étapes sont finies
          const allStepsCompleted = updatedSteps.length > 0 && updatedSteps.every(s => s.completed);
          
          return {
            ...goal,
            steps: updatedSteps,
            // Marquer l'objectif comme terminé automatiquement si toutes les étapes sont faites
            completedAt: allStepsCompleted && !goal.completedAt 
              ? new Date().toISOString() 
              : (!allStepsCompleted && goal.completedAt ? undefined : goal.completedAt),
          };
        }
        return goal;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Objectifs</h2>
          <p className="text-gray-600 mt-1">Définissez et suivez vos ambitions</p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouvel objectif
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 w-fit">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'En cours' : 'Terminés'}
          </button>
        ))}
      </div>

      {/* Liste des objectifs */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif trouvé</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier objectif !</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Créer un objectif maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onToggleStep={handleToggleStep}
            />
          ))}
        </div>
      )}

      {/* Formulaire Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onSave={handleSaveGoal}
          onCancel={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
}