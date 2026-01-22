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
  setHabitVisual,
} from '../services/habitsService';
import {
  getHabitLogsAPI,
  logHabitTodayAPI,
  deleteHabitLogAPI,
} from '../services/habitLogsService';
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
      const baseHabits = await getHabitsAPI(token);

      // Récupérer les logs sur les 7 derniers jours (pour l’affichage calendrier)
      const today = new Date();
      const end = today.toISOString().split('T')[0];
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      const start = startDate.toISOString().split('T')[0];

      const habitsWithLogs = await Promise.all(
        baseHabits.map(async (h) => {
          try {
            const logs = await getHabitLogsAPI(token, h.id, {
              start_date: start,
              end_date: end,
            });
            return { ...h, logs };
          } catch (e) {
            console.error(`Erreur logs habitude ${h.id}:`, e);
            return { ...h, logs: h.logs || [] };
          }
        })
      );

      setHabits(habitsWithLogs);
    } catch (error) {
      console.error('Erreur lors de la récupération des habitudes:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabitToday = async (habitId, dateStr, isCurrentlyCompleted) => {
    // Le back ne crée un log que pour "aujourd’hui" (logHabitToday).
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr !== todayStr) return;

    try {
      const token = localStorage.getItem('token');

      if (isCurrentlyCompleted) {
        await deleteHabitLogAPI(token, habitId, dateStr);
      } else {
        await logHabitTodayAPI(token, habitId, { notes: '' });
      }

      // Refresh ciblé des logs (7 derniers jours) pour cette habitude
      const end = todayStr;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const start = startDate.toISOString().split('T')[0];
      const newLogs = await getHabitLogsAPI(token, habitId, {
        start_date: start,
        end_date: end,
      });

      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, logs: newLogs } : h))
      );
    } catch (error) {
      console.error('Erreur toggle log habitude:', error);
      alert(error.message);
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
        // Les visuels (icône/couleur) ne sont pas persistés en back => on les garde en front.
        if (habitInput.icon || habitInput.color) {
          setHabitVisual(editingHabit.id, {
            icon: habitInput.icon,
            color: habitInput.color,
          });
        }
      } else {
        const created = await createHabitAPI(token, payload);
        if (habitInput.icon || habitInput.color) {
          setHabitVisual(created.id, {
            icon: habitInput.icon,
            color: habitInput.color,
          });
        }
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
              onToggle={handleToggleHabitToday}
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