import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ProgressChart({ habits }) {
  const today = new Date();
  
  // Générer les 7 derniers jours
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  // Préparer les données pour le graphique
  const data = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    
    const completedCount = habits.filter(habit =>
      // On utilise ?. pour éviter les erreurs si logs est indéfini
      habit.logs?.some(log => log.date === dateStr && log.completed)
    ).length;

    return {
      // Formatage de la date en français (ex: "lun. 12")
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      completed: completedCount,
    };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false} // Pour ne pas afficher "0.5 habitude"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#374151', fontWeight: 500 }}
          />
          <Bar
            dataKey="completed"
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
            name="Habitudes complétées"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}