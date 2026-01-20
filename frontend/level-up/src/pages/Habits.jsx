import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';

export default function Habits() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleSaveHabit = (habit) => {
    if (editingHabit) {
      setHabits(habits.map(h => (h.id === habit.id ? habit : h)));
    } else {
      setHabits([...habits, habit]);
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDeleteHabit = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette habitude ?")) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const handleToggleHabit = (habitId, date) => {
    setHabits(
      habits.map(habit => {
        if (habit.id === habitId) {
          const existingLog = habit.logs.find(log => log.date === date);
          let updatedLogs;
          
          if (existingLog) {
            updatedLogs = habit.logs.map(log =>
              log.date === date ? { ...log, completed: !log.completed } : log
            );
          } else {
            updatedLogs = [...habit.logs, { date, completed: true }];
          }

          // Calculate streak
          const today = new Date();
          let streak = 0;
          let currentDate = new Date(today);

          while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const log = updatedLogs.find(l => l.date === dateStr);
            
            if (log && log.completed) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              // Si on ne trouve pas de log pour aujourd'hui, on ne casse pas la série
              // seulement si on vérifie le passé. Mais pour simplifier ici :
              if (dateStr !== today.toISOString().split('T')[0]) {
                 break; 
              }
              // Petite correction logique pour ne pas casser la streak si on n'a pas encore coché aujourd'hui
              currentDate.setDate(currentDate.getDate() - 1);
            }
          }

          // Recalcul simplifié de la streak pour l'affichage immédiat
          // (Compte les jours consécutifs cochés en partant d'aujourd'hui ou hier)
          // Note: Le code original avait une logique de streak un peu complexe,
          // on garde celle fournie par défaut qui semble correcte.

          return {
            ...habit,
            logs: updatedLogs,
            streak, // Idéalement, recalcule la streak ici
          };
        }
        return habit;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
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

      {/* Habits List */}
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
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              onToggle={handleToggleHabit}
            />
          ))}
        </div>
      )}

      {/* Habit Form Modal */}
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