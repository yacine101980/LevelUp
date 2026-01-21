import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter } from 'lucide-react';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/GoalForm';
import { getGoalsAPI, createGoalAPI, updateGoalAPI, deleteGoalAPI, completeGoalAPI, abandonGoalAPI } from '../services/goalsService';

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
    if (filter === 'active') return goal.status === 'active' ;
    if (filter === 'completed') return goal.status === 'completed';
    if (filter === 'abandoned') return goal.status === 'abandoned';
    return true;
  });

  const handleSaveGoal = async (goal) => {
    try {
      const token = localStorage.getItem('token');
      
      // Préparer les données à envoyer
      const data = {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority || 'medium',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null,
        steps: goal.steps ? goal.steps.map(s => ({
          id: s.id, // Important pour l'update
          title: s.title,
          deadline: s.deadline ? new Date(s.deadline).toISOString() : null,
          completed: s.completed || false
        })) : [],
      };
      
      console.log('Sending data:', data);

      if (editingGoal) {
        // Mode UPDATE - on envoie TOUTES les données incluant les steps
        await updateGoalAPI(token, editingGoal.id, data);
      } else {
        // Mode CREATE
        await createGoalAPI(token, data);
      }
      
      await fetchGoals(); // Recharger les objectifs
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'objectif: ' + error.message);
    }
  };

  const handleEditGoal = (goal) => {
    console.log('Editing goal:', goal); // Debug
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
        alert('Erreur lors de la suppression de l\'objectif: ' + error.message);
      }
    }
  };

  const handleAbandonGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await abandonGoalAPI(token, id);
      await fetchGoals();
    } catch (error) {
      console.error('Erreur lors de l\'abandon:', error);
      alert('Erreur lors de l\'abandon de l\'objectif: ' + error.message);
    }
  };

  const handleCompleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await completeGoalAPI(token, id);
      await fetchGoals();
    } catch (error) {
      console.error('Erreur lors de la completion:', error);
      alert('Erreur lors de la completion de l\'objectif: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
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
          onClick={() => {
            setEditingGoal(null);
            setShowForm(true);
          }}
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
          {['all', 'active', 'completed', 'abandoned'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === status 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : status === 'abandoned' ? 'Abandonnés' : 'Terminés'}
            </button>
          ))}
        </div>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Aucun objectif. Créez votre premier objectif !' 
              : `Aucun objectif ${filter === 'active' ? 'actif' : filter === 'abandoned' ? 'Abandonnés' : 'terminé'}.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onComplete={handleCompleteGoal}
              onStepUpdate={fetchGoals} // Rafraîchir après update d'une étape
              onAbandon={handleAbandonGoal}
            />
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
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