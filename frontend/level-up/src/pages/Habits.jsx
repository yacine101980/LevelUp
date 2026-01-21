import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import {
  getHabitsAPI,
  createHabitAPI,
  updateHabitAPI,
  archiveHabitAPI,
} from '../services/habitsService';
export default function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  useEffect(() => {
    if (user) fetchHabits();
    else setLoading(false);
  }, [user]);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getHabitsAPI(token);
      setHabits(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des habitudes:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHabit = async (habitInput) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: habitInput.title,
        description: habitInput.description,
        frequency: habitInput.frequency,
        category: habitInput.category || null,
        weekly_target:
          habitInput.frequency === 'weekly' ? habitInput.weekly_target || 1 : null,
      };

      if (editingHabit) {
        await updateHabitAPI(token, editingHabit.id, payload);
      } else {
        await createHabitAPI(token, payload);
      }

      await fetchHabits();
      setShowForm(false);
      setEditingHabit(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.message);
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm('Voulez-vous vraiment archiver cette habitude ?')) return;
    try {
      const token = localStorage.getItem('token');
      await archiveHabitAPI(token, id);
      await fetchHabits();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Habitudes</h2>
          <p className="text-gray-600 mt-1">Créez et suivez vos habitudes quotidiennes</p>
        </div>
        <button
          onClick={() => {
            setEditingHabit(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nouvelle habitude
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune habitude</h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre première habitude pour maintenir votre discipline
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Créer une habitude maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              //  onToggle={handleToggleHabit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSaveHabit}
          onCancel={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}