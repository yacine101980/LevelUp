const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

const icons = ['💪', '📚', '🏃', '🧘', '💧', '🎯', '✍️', '🎨', '🎵', '🌱'];
const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const pickVisual = (id = 0) => ({
  icon: icons[id % icons.length],
  color: colors[id % colors.length],
});

const parseError = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return response.statusText || fallback;
  }
};

const normalizeHabit = (habit) => {
  const { icon, color } = pickVisual(habit.id);
  const logs = (habit.habitLogs || []).map((log) => ({
    date: new Date(log.date).toISOString().split('T')[0],
    completed: log.is_completed,
  }));
  return {
    id: habit.id,
    title: habit.name,
    description: habit.description || '',
    frequency: habit.frequency,
    category: habit.category || '',
    weekly_target: habit.weekly_target || null,
    start_date: habit.start_date,
    is_archived: habit.is_archived,
    icon,
    color,
    logs,
    streak: 0,
  };
};

export const getHabitsAPI = async (token) => {
  const response = await fetch(`${API_BASE}/habits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(await parseError(response, 'Erreur lors du chargement des habitudes'));
  const data = await response.json();
  return data.map(normalizeHabit);
};

export const createHabitAPI = async (token, payload) => {
  const response = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response, 'Erreur lors de la création de l’habitude'));
  return normalizeHabit(await response.json());
};

export const updateHabitAPI = async (token, id, payload) => {
  const response = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response, 'Erreur lors de la mise à jour de l’habitude'));
  return normalizeHabit(await response.json());
};

export const archiveHabitAPI = async (token, id) => {
  const response = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(await parseError(response, 'Erreur lors de la suppression de l’habitude'));
  return await response.json();
};