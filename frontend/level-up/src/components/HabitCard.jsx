import React from 'react';
import { Edit2, Trash2, Flame, Calendar, CheckCircle2 } from 'lucide-react';

export default function HabitCard({ habit, onEdit, onDelete, onToggle }) {
  const today = new Date();
  
  // Générer les 7 derniers jours pour le calendrier visuel
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date;
  });
  const logs = habit.logs || [];
  const completedDays = logs.filter((log) => log.completed).length;
  const title = habit.title || habit.name || 'Habitude';

  return (
    <div
      className="bg-white rounded-xl p-6 border-2 shadow-sm transition-all hover:shadow-md"
      style={{ borderColor: `${(habit.color || '#3b82f6')}40` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${(habit.color || '#3b82f6')}30` }}
          >
            {habit.icon || '💪'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{habit.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Série</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{habit.streak || 0}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Total</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{completedDays}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-600">Fréquence</span>
          </div>
          <div className="text-xs font-bold text-gray-900 uppercase">
            {habit.frequency === 'weekly' ? 'Hebdo' : 'Quotidien'}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">7 derniers jours</h4>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const log = logs.find((l) => l.date === dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];

            return (
              <button
                key={dateStr}
                // onClick={() => onToggle(habit.id, dateStr)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all ${
                  log?.completed
                    ? 'shadow-sm'
                    : isToday
                    ? 'border-2 hover:bg-gray-50'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: log?.completed ? habit.color : 'white',
                  borderColor: isToday && !log?.completed ? habit.color : undefined,
                }}
              >
                <span className={`text-xs font-medium ${log?.completed ? 'text-white' : 'text-gray-600'}`}>
                  {date.toLocaleDateString('fr-FR', { weekday: 'short' }).charAt(0).toUpperCase()}
                </span>
                <span className={`text-xs ${log?.completed ? 'text-white' : 'text-gray-500'}`}>
                  {date.getDate()}
                </span>
                {log?.completed && <CheckCircle2 className="w-4 h-4 text-white mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}