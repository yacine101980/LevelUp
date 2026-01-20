import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter } from 'lucide-react';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { getGoalsAPI, createGoalAPI, updateGoalAPI, deleteGoalAPI, completeGoalAPI } from '../services/goalsService';

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const data = await getGoalsAPI(token);
      setGoals(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des objectifs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.status !== 'completed';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  const handleSaveGoal = async (goal) => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority || 'medium',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null,
        // steps omis pour l'instant
      };
      console.log('Sending data:', data); // Pour déboguer

      if (editingGoal) {
        await updateGoalAPI(token, editingGoal.id, data);
      } else {
        await createGoalAPI(token, data);
      }
      await fetchGoals();
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'objectif');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      try {
        const token = localStorage.getItem('token');
        await deleteGoalAPI(token, id);
        await fetchGoals();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'objectif');
      }
    }
  };

  const handleCompleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await completeGoalAPI(token, id);
      await fetchGoals();
    } catch (error) {
      console.error('Erreur lors de la completion:', error);
      alert('Erreur lors de la completion de l\'objectif');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Objectifs</h2>
          <p className="text-gray-600 mt-1">Définissez et suivez vos objectifs personnels</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvel Objectif
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          {['all', 'active', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === status ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 'Terminés'}
            </button>
          ))}
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            onComplete={handleCompleteGoal}
            onToggleStep={() => {}} // Non implémenté pour l'instant
          />
        ))}
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <GoalForm
              goal={editingGoal}
              onSave={handleSaveGoal}
              onCancel={() => { setShowForm(false); setEditingGoal(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}