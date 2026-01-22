import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export function CategoryChart({ goalStats }) {
  // Grouper par catégorie
  const categoryData = goalStats.reduce((acc, stat) => {
    const category = stat.category || 'Sans catégorie';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += stat._count;
    return acc;
  }, {});

  const data = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

