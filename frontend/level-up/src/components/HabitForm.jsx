import React, { useState } from 'react';
import { X } from 'lucide-react';

const habitIcons = ['💪', '📚', '🏃', '🧘', '💧', '🎯', '✍️', '🎨', '🎵', '🌱'];
const habitColors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export default function HabitForm({ habit, onSave, onCancel }) {
  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily');
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || '💪');
  const [selectedColor, setSelectedColor] = useState(habit?.color || '#3b82f6');
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.weekly_target || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      frequency,
      weekly_target: frequency === 'weekly' ? weeklyTarget : null,
      icon: selectedIcon,
      color: selectedColor,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {habit ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
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
              Nom de l'habitude *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Ex: Faire du sport"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="30 minutes d'exercice"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  frequency === 'daily'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Quotidien</div>
                <div className="text-xs text-gray-600 mt-1">Tous les jours</div>
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  frequency === 'weekly'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Hebdomadaire</div>
                <div className="text-xs text-gray-600 mt-1">Chaque semaine</div>
              </button>
            </div>
          </div>

          {/* Weekly target */}
          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif hebdomadaire *
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={weeklyTarget}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  setWeeklyTarget(Math.max(1, Math.min(7, value)));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ex: 3"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Nombre de fois à réaliser l’habitude sur une semaine (1 à 7).
              </p>
            </div>
          )}

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icône *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {habitIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`aspect-square rounded-lg text-2xl flex items-center justify-center border-2 transition-all ${
                    selectedIcon === icon
                      ? 'border-indigo-600 bg-indigo-50 scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Couleur *
            </label>
            <div className="grid grid-cols-8 gap-2">
              {habitColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? 'border-gray-900 scale-110'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
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
              {habit ? 'Enregistrer' : 'Créer l\'habitude'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}